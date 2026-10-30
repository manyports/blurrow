/* blurrow: set up @blurrow/ui, copy components, keep them honest.

     npx @blurrow/ui init        set up a project
     npx blurrow add button      copy a component's source
     npx blurrow list            what's in the kit
     npx blurrow diff [name]     what you've changed in copied components
     npx blurrow doctor          check the setup                       */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { c, choose, confirm, interactive, log, multiselect, sym } from "./term";
import { categories, diffLines, findEntry, hunks, registry, sourceFile, SOURCE_DIR, suggest, withDependencies } from "./components";
import {
  CONFIG_FILE,
  defaultComponentsDir,
  findCss,
  findLayout,
  inspectCss,
  installCommand,
  installedMajor,
  PKG,
  patchCss,
  patchLayout,
  readProject,
  sourcePathFor,
  walk,
  writeFile,
  type Project,
} from "./project";

declare const __VERSION__: string;

/* ── arguments ───────────────────────────────────────────────────── */

interface Flags {
  yes: boolean;
  dryRun: boolean;
  overwrite: boolean;
  fix: boolean;
  install: boolean;
  cwd: string;
  dir?: string;
}

function parse(argv: string[]) {
  const flags: Flags = { yes: false, dryRun: false, overwrite: false, fix: false, install: true, cwd: process.cwd() };
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-y" || a === "--yes") flags.yes = true;
    else if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--overwrite") flags.overwrite = true;
    else if (a === "--fix") flags.fix = true;
    else if (a === "--no-install") flags.install = false;
    else if (a === "--cwd") flags.cwd = path.resolve(argv[++i] ?? ".");
    else if (a.startsWith("--cwd=")) flags.cwd = path.resolve(a.slice(6));
    else if (a === "--dir") flags.dir = argv[++i];
    else if (a.startsWith("--dir=")) flags.dir = a.slice(6);
    else rest.push(a);
  }
  return { command: rest[0], args: rest.slice(1), flags };
}

const HELP = `
${c.bold("blurrow")} ${c.gray(`v${__VERSION__}`)}  ${c.gray("tactile react components")}

${c.bold("usage")}
  npx @blurrow/ui ${c.cyan("<command>")} [options]     ${c.gray("or, once installed: npx blurrow <command>")}

${c.bold("commands")}
  ${c.cyan("init")}               set up this project: install, styles, font, config
  ${c.cyan("add")} [names…]       copy components' source into your project ${c.gray("(picker if no names)")}
  ${c.cyan("list")}               every component, and which ones you've copied
  ${c.cyan("diff")} [name]        what you've changed in copied components
  ${c.cyan("doctor")}             check the setup and say how to fix anything off

${c.bold("options")}
  -y, --yes          accept the defaults, don't ask
  --dry-run          show what would change, write nothing
  --cwd <path>       run as if from another folder
  --dir <path>       where copied components go ${c.gray("(default: components/ui)")}
  --overwrite        replace copied files even if you've changed them
  --fix              (doctor) repair the stylesheet setup
  --no-install       (init) don't install anything
  -v, --version      print the version

${c.bold("examples")}
  npx @blurrow/ui init
  npx @blurrow/ui add button tabs toast
  npx @blurrow/ui diff
`;

/* ── shared bits ─────────────────────────────────────────────────── */

function header(title: string) {
  log.line(`\n${c.bold("blurrow")} ${c.gray("·")} ${title}${c.gray(`  v${__VERSION__}`)}`);
}

function requireProject(flags: Flags): Project {
  const p = useProject(readProject(flags.cwd));
  if (!p.pkg) {
    log.line();
    log.fail(`no package.json in ${c.bold(rel(flags.cwd))}`);
    log.hint("run this inside your app, or point at it with --cwd <path>");
    process.exit(1);
  }
  return p;
}

const rel = (abs: string) => path.relative(process.cwd(), abs) || ".";

/* The short `${bin}` only reaches this CLI when the package is
   installed; otherwise npx would fetch whatever else is called that. */
let bin = `npx ${PKG}`;
const useProject = (p: Project) => {
  bin = p.deps[PKG] && fs.existsSync(path.join(p.root, "node_modules", PKG)) ? "npx blurrow" : `npx ${PKG}`;
  return p;
};

function componentsDir(p: Project, flags: Flags) {
  return flags.dir ?? p.config?.componentsDir ?? defaultComponentsDir(p.root);
}

function run(cmd: string[], flags: Flags, cwd: string) {
  log.info(c.gray(cmd.join(" ")));
  if (flags.dryRun) return true;
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd, stdio: "inherit", shell: process.platform === "win32" });
  return r.status === 0;
}

function printHunks(lines: ReturnType<typeof hunks>) {
  for (const l of lines) {
    if (!l) log.line(c.gray("    ⋯"));
    else if (l.kind === "-") log.line(c.red(`    - ${l.text}`));
    else if (l.kind === "+") log.line(c.green(`    + ${l.text}`));
    else log.line(c.gray(`      ${l.text}`));
  }
}

/* How the user will import a copied file, from their tsconfig paths */
function importPathFor(p: Project, dir: string, file: string) {
  try {
    const raw = fs.readFileSync(path.join(p.root, "tsconfig.json"), "utf8").replace(/\/\/.*$/gm, "").replace(/,(\s*[}\]])/g, "$1");
    const paths: Record<string, string[]> = JSON.parse(raw)?.compilerOptions?.paths ?? {};
    for (const [alias, targets] of Object.entries(paths)) {
      const prefix = alias.replace(/\*$/, "");
      const target = (targets[0] ?? "").replace(/^\.\//, "").replace(/\*$/, "");
      if (dir.startsWith(target)) return `${prefix}${dir.slice(target.length)}/${file}`.replace(/\/+/g, "/");
    }
  } catch {}
  return `./${dir}/${file}`;
}

const LAYOUT_SNIPPET = (isNext: boolean) =>
  isNext
    ? `import { Archivo } from "next/font/google";
import { ToastProvider } from "${PKG}";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

// on <html>:   className={archivo.variable}
// in <body>:   <ToastProvider>{children}</ToastProvider>   (only if you use toasts)`
    : `<!-- in your html <head> -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" />
<style>:root { --font-archivo: "Archivo"; }</style>

// around your app, if you use toasts:
import { ToastProvider } from "${PKG}";
<ToastProvider><App /></ToastProvider>`;

/* ── init ────────────────────────────────────────────────────────── */

async function init(flags: Flags) {
  header("init");
  const p = requireProject(flags);
  const isNext = Boolean(p.deps.next);
  const ask = (q: string, d = true) => confirm(q, d, flags.yes);

  log.step("project");
  log.ok(`${c.bold(String(p.pkg?.name ?? path.basename(p.root)))} ${c.gray(`· ${isNext ? "next.js" : "react"} · ${p.pm}`)}`);

  const react = installedMajor(p.root, "react", p.deps.react);
  if (react === null) log.warn("react isn't installed here");
  else if (react < 19) log.warn(`react ${react} found; ${PKG} is built for react 19`);
  else log.ok(`react ${react}`);

  const tw = installedMajor(p.root, "tailwindcss", p.deps.tailwindcss);
  if (tw !== null && tw >= 4) log.ok(`tailwind css ${tw}`);
  else {
    log.warn(tw === null ? "tailwind css isn't installed" : `tailwind css ${tw} found; v4 is needed`);
    const pkgs = isNext ? ["tailwindcss@4", "@tailwindcss/postcss@4"] : ["tailwindcss@4"];
    if (flags.install && (await ask("install tailwind css v4 now?"))) {
      if (!run(installCommand(p.pm, pkgs), flags, p.root)) log.fail("couldn't install tailwind; try it yourself and run init again");
    } else log.hint(`later: ${installCommand(p.pm, pkgs).join(" ")}`);
  }

  if (p.deps[PKG]) log.ok(`${PKG} ${c.gray(p.deps[PKG])}`);
  else if (flags.install && (await ask(`install ${PKG}?`))) {
    if (!run(installCommand(p.pm, [PKG]), flags, p.root)) {
      log.fail(`install failed; run ${installCommand(p.pm, [PKG]).join(" ")} and try again`);
      process.exit(1);
    }
    log.ok(`installed ${PKG}`);
  } else log.hint(`later: ${installCommand(p.pm, [PKG]).join(" ")}`);

  log.step("styles");
  const css = findCss(p);
  if (!css) {
    log.warn("couldn't find the stylesheet that imports tailwind");
    log.hint(`add these lines to it yourself:`);
    log.line(c.cyan(`\n    @import "tailwindcss";\n    @import "${PKG}/styles.css";\n    @source "<path to>/node_modules/${PKG}";\n`));
  } else {
    const before = fs.readFileSync(path.join(p.root, css), "utf8");
    const after = patchCss(before, css, "package");
    if (!after) log.ok(`${css} is already set up`);
    else {
      log.info(`${c.bold(css)} needs:`);
      printHunks(hunks(diffLines(before, after), 1));
      if (await ask(`update ${css}?`)) {
        writeFile(p.root, css, after, flags.dryRun);
        log.ok(`updated ${css}`);
      } else log.hint(`skipped; run ${bin} doctor --fix whenever you like`);
    }
  }

  log.step("font & toasts");
  const layout = findLayout(p.root);
  const layoutText = layout ? fs.readFileSync(path.join(p.root, layout), "utf8") : "";
  const hasFont = layoutText.includes("--font-archivo");
  const hasToasts = layoutText.includes("ToastProvider");
  if (hasFont) log.ok(`archivo is loaded in ${layout}`);
  if (hasToasts) log.ok(`ToastProvider is in ${layout}`);
  let layoutDone = hasFont && hasToasts;
  if (!layoutDone && layout && isNext) {
    const patched = patchLayout(layoutText, !hasFont, !hasToasts);
    if (patched) {
      log.info(`${c.bold(layout)} needs:`);
      printHunks(hunks(diffLines(layoutText, patched), 1));
      if (await ask(`update ${layout}?`)) {
        writeFile(p.root, layout, patched, flags.dryRun);
        log.ok(`updated ${layout}`);
        layoutDone = true;
      }
    }
  }
  if (!layoutDone) {
    log.info(`add this to ${c.bold(layout ?? "your root layout")}:`);
    log.line(
      "\n" +
        LAYOUT_SNIPPET(isNext)
          .split("\n")
          .map((l) => c.cyan(`    ${l}`))
          .join("\n") +
        "\n",
    );
  }

  const config = { componentsDir: componentsDir(p, flags), ...(css ? { css } : {}) };
  const cfgText = JSON.stringify(config, null, 2) + "\n";
  const cfgPath = path.join(p.root, CONFIG_FILE);
  if (!fs.existsSync(cfgPath) || fs.readFileSync(cfgPath, "utf8") !== cfgText) {
    writeFile(p.root, CONFIG_FILE, cfgText, flags.dryRun);
    log.step("config");
    log.ok(`wrote ${CONFIG_FILE} ${c.gray(`(components go to ${config.componentsDir})`)}`);
  }

  log.line(`\n${c.bold("all set!")} ${flags.dryRun ? c.yellow("(dry run, nothing was written)") : ""}`);
  log.line(`  ${c.gray("use it:")}    import { Button } from "${PKG}";`);
  log.line(`  ${c.gray("own it:")}    ${bin} add button`);
  log.line(`  ${c.gray("check it:")}  ${bin} doctor\n`);
}

/* ── add ─────────────────────────────────────────────────────────── */

async function add(names: string[], flags: Flags) {
  header("add");
  const p = requireProject(flags);
  const dir = componentsDir(p, flags);

  if (!names.length) {
    if (!interactive) {
      log.fail(`which components? e.g. ${bin} add button tabs`);
      process.exit(1);
    }
    log.line();
    names = await multiselect(
      "pick components to copy",
      registry.map((e) => ({
        value: e.slug,
        label: e.slug,
        group: e.category,
        hint: e.description,
      })),
    );
    if (!names.length) {
      log.line(c.gray("\n  nothing picked, nothing copied.\n"));
      return;
    }
  }

  const unknown = names.filter((n) => !findEntry(n));
  if (unknown.length) {
    log.line();
    for (const n of unknown) {
      const s = suggest(n);
      log.fail(`no component called ${c.bold(n)}${s.length ? c.gray(`. did you mean ${s.map((x) => c.cyan(x)).join(", ")}?`) : ""}`);
    }
    log.hint(`see them all with: ${bin} list`);
    process.exit(1);
  }

  const entries = [...new Set(names.map((n) => findEntry(n)!))];
  const files = withDependencies(entries.map((e) => e.file));
  const extra = files.length - entries.length;
  log.line();
  log.info(
    `copying ${c.bold(entries.map((e) => e.slug).join(", "))}${extra > 0 ? c.gray(` + ${extra} file${extra > 1 ? "s" : ""} they need`) : ""} into ${c.bold(dir)}`,
  );

  const result = { added: [] as string[], updated: [] as string[], same: [] as string[], skipped: [] as string[] };
  for (const f of files) {
    const target = `${dir}/${f.name}`;
    const abs = path.join(p.root, target);
    if (fs.existsSync(abs)) {
      const current = fs.readFileSync(abs, "utf8");
      if (current === f.code) {
        result.same.push(f.name);
        continue;
      }
      let decision: "overwrite" | "skip" | "diff" = flags.overwrite ? "overwrite" : "skip";
      while (!flags.overwrite && interactive && !flags.yes) {
        decision = await choose(`${c.bold(target)} has your changes.`, [
          { key: "skip", label: "skip" },
          { key: "overwrite", label: "overwrite" },
          { key: "diff", label: "diff" },
        ], "skip");
        if (decision !== "diff") break;
        printHunks(hunks(diffLines(current, f.code)));
      }
      if (decision === "overwrite") {
        writeFile(p.root, target, f.code, flags.dryRun);
        result.updated.push(f.name);
      } else result.skipped.push(f.name);
      continue;
    }
    writeFile(p.root, target, f.code, flags.dryRun);
    result.added.push(f.name);
  }

  // Copied components need the tokens: from the package, or a local copy
  const css = findCss(p);
  const cssState = css ? inspectCss(p.root, css) : null;
  if (!cssState?.styles) {
    const stylesRel = `${dir}/styles.css`;
    if (!fs.existsSync(path.join(p.root, stylesRel))) {
      writeFile(p.root, stylesRel, fs.readFileSync(path.join(SOURCE_DIR, "styles.css"), "utf8"), flags.dryRun);
      result.added.push("styles.css");
    }
    if (css) {
      const patched = patchCss(fs.readFileSync(path.join(p.root, css), "utf8"), css, "local", stylesRel);
      if (patched) {
        writeFile(p.root, css, patched, flags.dryRun);
        log.ok(`imported the tokens in ${css}`);
      }
    } else log.warn(`import ${stylesRel} in your global stylesheet, right after tailwind`);
  }

  log.line();
  for (const n of result.added) log.ok(`${c.green("added")}    ${dir}/${n}`);
  for (const n of result.updated) log.ok(`${c.yellow("updated")}  ${dir}/${n}`);
  for (const n of result.same) log.line(`  ${sym.dot} ${c.gray(`same     ${dir}/${n}`)}`);
  for (const n of result.skipped) log.warn(`${c.yellow("skipped")}  ${dir}/${n} ${c.gray("(kept your changes; --overwrite to replace)")}`);

  const first = entries[0];
  log.line(`\n  ${c.gray("import it:")} import { ${first.file} } from "${importPathFor(p, dir, first.file)}";`);
  if (flags.dryRun) log.line(`  ${c.yellow("dry run, nothing was written")}`);
  log.line();
}

/* ── list ────────────────────────────────────────────────────────── */

function list(flags: Flags) {
  const p = useProject(readProject(flags.cwd));
  const dir = p.pkg ? componentsDir(p, flags) : null;
  const copied = (file: string) =>
    dir && [".tsx", ".ts"].some((ext) => fs.existsSync(path.join(p.root, dir, file + ext)));

  log.line(`\n${c.bold("blurrow")} ${c.gray(`· ${registry.length} components`)}\n`);
  const width = Math.max(...registry.map((e) => e.slug.length)) + 2;
  for (const cat of categories) {
    log.line(`  ${c.bold(cat)}`);
    for (const e of registry.filter((x) => x.category === cat)) {
      const mark = copied(e.file) ? c.green("●") : " ";
      const desc = e.description.length > 64 ? e.description.slice(0, 63) + "…" : e.description;
      log.line(`  ${mark} ${c.cyan(e.slug.padEnd(width))}${c.gray(desc)}`);
    }
    log.line();
  }
  log.line(c.gray(`  ${c.green("●")} copied into ${dir ?? "your project"}   ·   ${bin} add <name>\n`));
}

/* ── diff ────────────────────────────────────────────────────────── */

function diff(names: string[], flags: Flags) {
  header("diff");
  const p = requireProject(flags);
  const dir = componentsDir(p, flags);

  const copied = registry.filter((e) => [".tsx", ".ts"].some((ext) => fs.existsSync(path.join(p.root, dir, e.file + ext))));
  let targets = copied;
  if (names.length) {
    targets = [];
    for (const n of names) {
      const e = findEntry(n);
      if (!e) {
        const s = suggest(n);
        log.fail(`no component called ${c.bold(n)}${s.length ? c.gray(`. did you mean ${s.join(", ")}?`) : ""}`);
        process.exit(1);
      }
      if (!copied.includes(e)) {
        log.fail(`${e.slug} isn't copied into ${dir}`);
        log.hint(`copy it with: ${bin} add ${e.slug}`);
        process.exit(1);
      }
      targets.push(e);
    }
  }
  if (!targets.length) {
    log.line();
    log.info(`no copied components in ${dir}`);
    log.hint(`if you use the package, there's nothing to diff. to own a component: ${bin} add <name>`);
    log.line();
    return;
  }

  let changed = 0;
  log.line();
  for (const e of targets) {
    const shipped = sourceFile(e.file);
    const local = fs.readFileSync(path.join(p.root, dir, shipped.name), "utf8");
    if (local === shipped.code) {
      log.ok(`${e.slug} ${c.gray("matches v" + __VERSION__)}`);
      continue;
    }
    changed++;
    const lines = diffLines(shipped.code, local);
    const plus = lines.filter((l) => l.kind === "+").length;
    const minus = lines.filter((l) => l.kind === "-").length;
    log.warn(`${c.bold(e.slug)} ${c.green(`+${plus}`)} ${c.red(`-${minus}`)} ${c.gray(`vs v${__VERSION__}`)}`);
    if (names.length) printHunks(hunks(lines));
  }
  log.line();
  if (changed && !names.length) log.hint(`see the changes in one: ${bin} diff <name>`);
  if (changed) log.hint(`take the shipped version: ${bin} add <name> --overwrite`);
  log.line();
}

/* ── doctor ──────────────────────────────────────────────────────── */

function doctor(flags: Flags) {
  header("doctor");
  const p = requireProject(flags);
  let problems = 0;
  let warnings = 0;
  const fail = (msg: string, fix?: string) => {
    problems++;
    log.fail(msg);
    if (fix) log.hint(fix);
  };
  const warn = (msg: string, fix?: string) => {
    warnings++;
    log.warn(msg);
    if (fix) log.hint(fix);
  };

  log.step("dependencies");
  const react = installedMajor(p.root, "react", p.deps.react);
  if (react === null) fail("react isn't installed", installCommand(p.pm, ["react", "react-dom"]).join(" "));
  else if (react < 19) fail(`react ${react}; the kit needs react 19`, installCommand(p.pm, ["react@19", "react-dom@19"]).join(" "));
  else log.ok(`react ${react}`);

  const tw = installedMajor(p.root, "tailwindcss", p.deps.tailwindcss);
  if (tw === null) fail("tailwind css isn't installed", installCommand(p.pm, ["tailwindcss@4"]).join(" "));
  else if (tw < 4) fail(`tailwind css ${tw}; the kit needs v4`, "see https://tailwindcss.com/docs/upgrade-guide");
  else log.ok(`tailwind css ${tw}`);

  const dir = componentsDir(p, flags);
  const usesPackage = Boolean(p.deps[PKG]);
  const copiedCount = registry.filter((e) => [".tsx", ".ts"].some((x) => fs.existsSync(path.join(p.root, dir, e.file + x)))).length;
  if (usesPackage) {
    const installed = fs.existsSync(path.join(p.root, "node_modules", PKG));
    if (installed) log.ok(`${PKG} ${c.gray(p.deps[PKG])}`);
    else fail(`${PKG} is in package.json but not installed`, `${p.pm} install`);
  } else if (copiedCount) log.ok(`${copiedCount} copied component${copiedCount > 1 ? "s" : ""} in ${dir}`);
  else fail(`${PKG} isn't installed and no components are copied`, `npx ${PKG} init`);

  log.step("styles");
  const css = findCss(p);
  let cssProblems = 0;
  if (!css) fail("no stylesheet imports tailwind", `add @import "tailwindcss"; to your global css, then run doctor again`);
  else {
    const s = inspectCss(p.root, css);
    let fixable = false;
    log.ok(`tailwind imported in ${css}`);
    if (s.styles === "package") log.ok(`tokens imported from ${PKG}/styles.css`);
    else if (s.styles === "local") log.ok("tokens imported from a local styles.css");
    else {
      fixable = true;
      cssProblems++;
      fail("the kit's tokens aren't imported", `add @import "${PKG}/styles.css"; after tailwind`);
    }
    if (usesPackage) {
      if (!s.source) {
        fixable = true;
        cssProblems++;
        fail("tailwind can't see the package's classes, so components render unstyled", `add @source "${sourcePathFor(css)}";`);
      } else if (!s.source.ok) {
        fixable = true;
        cssProblems++;
        fail(`@source "${s.source.line}" points at nothing`, `it should be @source "${sourcePathFor(css)}";`);
      } else log.ok(`tailwind scans ${s.source.line}`);
    }
    if (fixable && flags.fix) {
      const before = fs.readFileSync(path.join(p.root, css), "utf8");
      const mode = usesPackage ? "package" : "local";
      const after = patchCss(before, css, mode, mode === "local" ? `${dir}/styles.css` : undefined);
      if (after) {
        writeFile(p.root, css, after, flags.dryRun);
        problems -= cssProblems;
        log.ok(c.green(`fixed ${css}`) + (flags.dryRun ? c.yellow(" (dry run)") : ""));
        printHunks(hunks(diffLines(before, after), 1));
      }
    } else if (fixable) log.hint(`let doctor fix it: ${bin} doctor --fix`);
  }

  log.step("font & toasts");
  const layout = findLayout(p.root);
  const sources = walk(p.root, (f) => /\.(tsx|jsx|ts|js|html)$/.test(f));
  const cache = new Map<string, string>();
  const read = (f: string) => {
    if (!cache.has(f)) cache.set(f, fs.readFileSync(path.join(p.root, f), "utf8"));
    return cache.get(f)!;
  };
  const fontFile = sources.find((f) => read(f).includes("--font-archivo"));
  if (fontFile) log.ok(`archivo loaded in ${fontFile}`);
  else warn("archivo isn't loaded, so the kit falls back to the system font", `load it as --font-archivo in ${layout ?? "your root layout"} (${bin} init prints the snippet)`);

  const usesToast = sources.find((f) => /\buseToast\s*\(/.test(read(f)) && !f.includes(dir));
  const hasProvider = sources.some((f) => /<ToastProvider/.test(read(f)) && !f.includes(dir));
  if (usesToast && !hasProvider) fail(`${usesToast} calls useToast() but nothing renders <ToastProvider>`, `wrap your app in <ToastProvider> in ${layout ?? "your root layout"}`);
  else if (hasProvider) log.ok("ToastProvider is set up");
  else log.line(`  ${sym.dot} ${c.gray("no toasts used yet")}`);

  log.line();
  if (!problems && !warnings) log.line(`${c.green(c.bold("all good!"))} everything's set up.\n`);
  else
    log.line(
      `${problems ? c.red(`${problems} problem${problems > 1 ? "s" : ""}`) : c.green("no problems")}${warnings ? c.gray(", ") + c.yellow(`${warnings} warning${warnings > 1 ? "s" : ""}`) : ""}\n`,
    );
  if (problems) process.exitCode = 1;
}

/* ── main ────────────────────────────────────────────────────────── */

async function main() {
  const { command, args, flags } = parse(process.argv.slice(2));
  if (command === "-v" || command === "--version") return log.line(__VERSION__);
  if (!command || command === "help" || command === "-h" || command === "--help") return log.line(HELP);

  switch (command) {
    case "init":
      return init(flags);
    case "add":
      return add(args, flags);
    case "list":
    case "ls":
      return list(flags);
    case "diff":
      return diff(args, flags);
    case "doctor":
      return doctor(flags);
    default: {
      const known = ["init", "add", "list", "diff", "doctor"];
      const guess = known.find((k) => k.startsWith(command.slice(0, 2)));
      log.line();
      log.fail(`unknown command ${c.bold(command)}${guess ? c.gray(`. did you mean ${c.cyan(guess)}?`) : ""}`);
      log.hint(`${bin} --help`);
      log.line();
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  log.line();
  log.fail(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
