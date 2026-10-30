/* Reading and patching the user's project. Every write goes through
   here so --dry-run is honoured everywhere.                       */
import fs from "node:fs";
import path from "node:path";

export const PKG = "@blurrow/ui";
export const CONFIG_FILE = "blurrow.json";

export interface Config {
  componentsDir: string;
  css?: string;
}

export interface Project {
  root: string;
  pkg: Record<string, unknown> | null;
  deps: Record<string, string>;
  pm: "npm" | "pnpm" | "yarn" | "bun";
  config: Config | null;
}

export function readProject(root: string): Project {
  const pkgPath = path.join(root, "package.json");
  const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, "utf8")) : null;
  const deps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) } as Record<string, string>;
  const cfgPath = path.join(root, CONFIG_FILE);
  const config = fs.existsSync(cfgPath) ? (JSON.parse(fs.readFileSync(cfgPath, "utf8")) as Config) : null;
  return { root, pkg, deps, pm: detectPm(root), config };
}

function detectPm(root: string): Project["pm"] {
  const has = (f: string) => fs.existsSync(path.join(root, f));
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("bun.lockb") || has("bun.lock")) return "bun";
  const agent = process.env.npm_config_user_agent ?? "";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("yarn")) return "yarn";
  if (agent.startsWith("bun")) return "bun";
  return "npm";
}

export function installCommand(pm: Project["pm"], pkgs: string[]) {
  const verb = pm === "npm" ? "install" : "add";
  return [pm, verb, ...pkgs];
}

/* The major version a range like ^19.1.0 or ~4 allows, if there is one */
export function majorOf(range: string | undefined): number | null {
  if (!range) return null;
  const m = range.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

/* The installed version wins over the range in package.json */
export function installedMajor(root: string, name: string, range?: string): number | null {
  const p = path.join(root, "node_modules", name, "package.json");
  if (fs.existsSync(p)) return majorOf(JSON.parse(fs.readFileSync(p, "utf8")).version);
  return majorOf(range);
}

const CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "styles/globals.css",
  "src/styles/globals.css",
  "src/index.css",
  "src/styles.css",
  "src/global.css",
  "app/app.css",
];

/* The stylesheet that imports tailwind: the configured one, a usual
   suspect, or whatever turns up in a shallow search.               */
export function findCss(p: Project): string | null {
  if (p.config?.css && fs.existsSync(path.join(p.root, p.config.css))) return p.config.css;
  const importsTailwind = (rel: string) => /@import\s+["']tailwindcss["']/.test(fs.readFileSync(path.join(p.root, rel), "utf8"));
  for (const rel of CSS_CANDIDATES) {
    if (fs.existsSync(path.join(p.root, rel)) && importsTailwind(rel)) return rel;
  }
  for (const rel of walk(p.root, (f) => f.endsWith(".css"), 4)) {
    if (importsTailwind(rel)) return rel;
  }
  return null;
}

const LAYOUT_CANDIDATES = ["app/layout.tsx", "src/app/layout.tsx", "app/layout.jsx", "src/app/layout.jsx", "app/root.tsx", "src/main.tsx", "src/App.tsx"];

export function findLayout(root: string): string | null {
  return LAYOUT_CANDIDATES.find((rel) => fs.existsSync(path.join(root, rel))) ?? null;
}

export function defaultComponentsDir(root: string) {
  return fs.existsSync(path.join(root, "src")) ? "src/components/ui" : "components/ui";
}

/* Source files under the project, skipping the usual heavy folders */
export function walk(root: string, match: (f: string) => boolean, depth = 6): string[] {
  const out: string[] = [];
  const skip = new Set(["node_modules", ".next", ".git", "dist", "build", "out", ".turbo", ".vercel", "coverage"]);
  const go = (dir: string, d: number) => {
    if (d > depth) return;
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".") && e.name !== ".") continue;
      const rel = dir ? `${dir}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (!skip.has(e.name)) go(rel, d + 1);
      } else if (match(rel)) out.push(rel);
    }
  };
  go("", 0);
  return out;
}

/* ── CSS ─────────────────────────────────────────────────────────── */

/* Where the package lives, relative to the stylesheet, for @source */
export function sourcePathFor(cssRel: string) {
  const fromDir = path.dirname(cssRel);
  const rel = path.relative(fromDir, `node_modules/${PKG}`).split(path.sep).join("/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

export interface CssState {
  tailwind: boolean;
  styles: "package" | "local" | null;
  source: { line: string; ok: boolean } | null;
}

export function inspectCss(root: string, cssRel: string): CssState {
  const css = fs.readFileSync(path.join(root, cssRel), "utf8");
  const tailwind = /@import\s+["']tailwindcss["']/.test(css);
  const styles = css.includes(`${PKG}/styles.css`) ? "package" : /@import\s+["'][^"']*styles\.css["']/.test(css) ? "local" : null;
  const m = css.match(new RegExp(`@source\\s+["']([^"']*${PKG.replace("/", "\\/")}[^"']*)["']`));
  const source = m ? { line: m[1], ok: fs.existsSync(path.resolve(root, path.dirname(cssRel), m[1])) } : null;
  return { tailwind, styles, source };
}

/* Adds the styles import and @source line if they're missing, and fixes
   an @source that points somewhere that doesn't exist. Returns the new
   text, or null when nothing needs to change.                        */
export function patchCss(text: string, cssRel: string, mode: "package" | "local", localStylesRel?: string): string | null {
  let out = text;
  const tailwindLine = out.match(/@import\s+["']tailwindcss["'][^;]*;\n?/);
  const insertAfterTailwind = (line: string) => {
    if (tailwindLine) {
      const at = out.indexOf(tailwindLine[0]) + tailwindLine[0].length;
      out = out.slice(0, at) + (tailwindLine[0].endsWith("\n") ? "" : "\n") + line + "\n" + out.slice(at);
    } else {
      out = `@import "tailwindcss";\n${line}\n` + out;
    }
  };

  if (mode === "package") {
    if (!out.includes(`${PKG}/styles.css`)) insertAfterTailwind(`@import "${PKG}/styles.css";`);
    const want = sourcePathFor(cssRel);
    const existing = out.match(new RegExp(`@source\\s+["']([^"']*${PKG.replace("/", "\\/")}[^"']*)["'];?`));
    if (!existing) {
      const anchor = out.match(new RegExp(`@import\\s+["']${PKG.replace("/", "\\/")}\\/styles\\.css["'];?\\n?`));
      const at = anchor ? out.indexOf(anchor[0]) + anchor[0].length : 0;
      out = out.slice(0, at) + `\n/* let tailwind see the classes ${PKG} uses */\n@source "${want}";\n` + out.slice(at);
    } else if (existing[1] !== want) {
      out = out.replace(existing[0], `@source "${want}";`);
    }
  } else if (localStylesRel) {
    const rel = path.relative(path.dirname(cssRel), localStylesRel).split(path.sep).join("/");
    const spec = rel.startsWith(".") ? rel : `./${rel}`;
    if (!out.includes(spec)) insertAfterTailwind(`@import "${spec}";`);
  }
  return out === text ? null : out;
}

export function writeFile(root: string, rel: string, text: string, dryRun: boolean) {
  if (dryRun) return;
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

/* ── layout ──────────────────────────────────────────────────────── */

/* Loads archivo and wraps the app in ToastProvider in a next.js root
   layout. Conservative: it only touches the shapes it recognises and
   returns null when it isn't sure, so the user gets a snippet instead. */
export function patchLayout(text: string, needFont: boolean, needToasts: boolean): string | null {
  let out = text;
  const lastImport = [...out.matchAll(/^import[^;]*;[ \t]*$/gm)].pop();
  if (!lastImport) return null;

  const imports: string[] = [];
  const decls: string[] = [];

  if (needFont) {
    const html = out.match(/<html\b[^>]*>/);
    if (!html) return null;
    let tag = html[0];
    const literal = tag.match(/className="([^"]*)"/);
    const expr = tag.match(/className=\{([^}]*)\}/);
    if (literal) tag = tag.replace(literal[0], `className={\`\${archivo.variable} ${literal[1]}\`}`);
    else if (expr) tag = tag.replace(expr[0], `className={\`\${archivo.variable} \${${expr[1].trim()}}\`}`);
    else tag = tag.replace(/<html\b/, "<html className={archivo.variable}");
    out = out.replace(html[0], tag);
    if (!/from\s+["']next\/font\/google["']/.test(out)) imports.push(`import { Archivo } from "next/font/google";`);
    else if (!/\bArchivo\b/.test(out)) return null;
    decls.push(`const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });`);
  }

  if (needToasts) {
    const body = out.match(/<body\b[^>]*>([\s\S]*?)<\/body>/);
    if (!body || !body[1].includes("{children}")) return null;
    out = out.replace(body[0], body[0].replace("{children}", "<ToastProvider>{children}</ToastProvider>"));
    imports.push(`import { ToastProvider } from "${PKG}";`);
  }

  if (!imports.length && !decls.length && out === text) return null;
  const at = out.indexOf(lastImport[0]) + lastImport[0].length;
  const head = imports.length ? "\n" + imports.join("\n") : "";
  const tail = decls.length ? "\n\n" + decls.join("\n") : "";
  out = out.slice(0, at) + head + tail + out.slice(at);
  return out;
}
