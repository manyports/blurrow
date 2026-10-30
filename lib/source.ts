import fs from "node:fs/promises";
import path from "node:path";
import { pkg } from "./site";

const root = process.cwd();
const UI_DIR = path.join(root, "components", "ui");
const EXAMPLES_DIR = path.join(root, "examples");

export interface SourceFile {
  name: string;
  code: string;
}

async function readUi(name: string) {
  for (const ext of [".tsx", ".ts"]) {
    try {
      const code = await fs.readFile(path.join(UI_DIR, name + ext), "utf8");
      return { name: name + ext, code };
    } catch {}
  }
  throw new Error(`components/ui/${name} not found`);
}

/* Examples import from local files so the docs can render them, but
   readers install the package, so the code they see imports from it. */
export async function readExample(name: string) {
  const code = (await fs.readFile(path.join(EXAMPLES_DIR, name + ".tsx"), "utf8")).trimEnd();
  const re = /^import \{ ([^}]+) \} from "@\/components\/ui\/[\w-]+";\n/gm;
  const names = [...code.matchAll(re)].flatMap((m) => m[1].split(",").map((n) => n.trim()));
  if (!names.length) return code;
  let first = true;
  return code.replace(re, () => {
    if (!first) return "";
    first = false;
    return `import { ${names.join(", ")} } from "${pkg}";\n`;
  });
}

/* A component and every sibling it imports, in install order: the
   component first, then its dependencies as they're discovered.    */
export async function getComponentFiles(entry: string): Promise<SourceFile[]> {
  const seen = new Map<string, SourceFile>();
  const visit = async (name: string) => {
    if (seen.has(name)) return;
    const file = await readUi(name);
    seen.set(name, file);
    for (const m of file.code.matchAll(/from\s+["']\.\/([\w-]+)["']/g)) {
      await visit(m[1]);
    }
  };
  await visit(entry);
  return [...seen.values()];
}

/* Exported runtime names, for the import line in Usage */
export function getExports(code: string) {
  return [...code.matchAll(/^export\s+(?:async\s+)?(?:function|const|class)\s+(\w+)/gm)].map((m) => m[1]);
}

/* Props interfaces, verbatim — the source is the API reference. Takes each
   `interface …Props` (and the item shapes they reference) up to its
   matching brace.                                                       */
export function getPropTypes(code: string) {
  const blocks: string[] = [];
  const re = /^(?:export\s+)?interface\s+(\w+)[^{]*\{/gm;
  let m: RegExpExecArray | null;
  const all: { name: string; body: string }[] = [];
  while ((m = re.exec(code))) {
    let depth = 0;
    let i = m.index + m[0].length - 1;
    for (; i < code.length; i++) {
      if (code[i] === "{") depth++;
      else if (code[i] === "}" && --depth === 0) break;
    }
    all.push({ name: m[1], body: code.slice(m.index, i + 1) });
  }

  // ToastCard is internal; the toast() options are Toast's public API
  const props = all.filter(
    (b) => (b.name.endsWith("Props") && b.name !== "ToastCardProps") || b.name === "ToastContextValue",
  );
  const referenced = all.filter(
    (b) => !props.includes(b) && props.some((p) => new RegExp(`\\b${b.name}\\b`).test(p.body)),
  );
  // Keep source order so types read top-down as they do in the file
  for (const b of all) if (props.includes(b) || referenced.includes(b)) blocks.push(b.body);

  // Union types the props lean on (variants, sizes, positions)
  const unions = [...code.matchAll(/^(?:export\s+)?type\s+(\w+)\s*=([^;]+);/gm)]
    .filter(
      (u) =>
        blocks.some((b) => new RegExp(`\\b${u[1]}\\b`).test(b)) ||
        props.some((p) => new RegExp(`\\b${p.name}\\b`).test(u[2])),
    )
    .map((u) => u[0].replace(/^export\s+/, ""));

  return [...unions, ...blocks.map((b) => b.replace(/^export\s+/, ""))].join("\n\n");
}
