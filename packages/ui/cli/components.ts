/* The catalogue and the shipped source files, as the CLI sees them */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories, registry, type RegistryEntry } from "../../../lib/registry";

export { categories, registry };
export type { RegistryEntry };

/* Copies of components/ui travel with the package, next to the CLI */
export const SOURCE_DIR = fileURLToPath(new URL("./registry/", import.meta.url));

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/* button, Button, button-group, ButtonGroup and "button group" all work */
export function findEntry(name: string): RegistryEntry | undefined {
  const k = squash(name);
  return registry.find((e) => squash(e.slug) === k || squash(e.file) === k || squash(e.name) === k);
}

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

/* The closest few names, for "did you mean" */
export function suggest(name: string): string[] {
  const k = squash(name);
  return registry
    .map((e) => ({ slug: e.slug, d: Math.min(distance(k, squash(e.slug)), squash(e.slug).startsWith(k) ? 0 : 99) }))
    .filter((x) => x.d <= Math.max(2, Math.floor(k.length / 3)))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((x) => x.slug);
}

export function sourceFile(file: string): { name: string; code: string } {
  for (const ext of [".tsx", ".ts"]) {
    const p = path.join(SOURCE_DIR, file + ext);
    if (fs.existsSync(p)) return { name: file + ext, code: fs.readFileSync(p, "utf8") };
  }
  throw new Error(`source for ${file} is missing from the package`);
}

/* A component's file plus every sibling it imports, in dependency order */
export function withDependencies(files: string[]): { name: string; code: string }[] {
  const seen = new Map<string, { name: string; code: string }>();
  const visit = (file: string) => {
    if (seen.has(file)) return;
    const src = sourceFile(file);
    seen.set(file, src);
    for (const m of src.code.matchAll(/from\s+["']\.\/([\w-]+)["']/g)) visit(m[1]);
  };
  files.forEach(visit);
  return [...seen.values()];
}

/* ── diff ────────────────────────────────────────────────────────── */

export interface DiffLine {
  kind: " " | "-" | "+";
  text: string;
}

/* Line diff by longest common subsequence; components are a few hundred
   lines at most, so the quadratic table is fine.                    */
export function diffLines(a: string, b: string): DiffLine[] {
  const x = a.split("\n");
  const y = b.split("\n");
  const n = x.length;
  const m = y.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) lcs[i][j] = x[i] === y[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      out.push({ kind: " ", text: x[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) out.push({ kind: "-", text: x[i++] });
    else out.push({ kind: "+", text: y[j++] });
  }
  while (i < n) out.push({ kind: "-", text: x[i++] });
  while (j < m) out.push({ kind: "+", text: y[j++] });
  return out;
}

/* Only the changed stretches, with a little context around each */
export function hunks(lines: DiffLine[], context = 3): (DiffLine | null)[] {
  const keep = new Set<number>();
  lines.forEach((l, i) => {
    if (l.kind !== " ") for (let k = i - context; k <= i + context; k++) keep.add(k);
  });
  const out: (DiffLine | null)[] = [];
  let last = -2;
  lines.forEach((l, i) => {
    if (!keep.has(i)) return;
    if (i !== last + 1 && out.length) out.push(null);
    out.push(l);
    last = i;
  });
  return out;
}
