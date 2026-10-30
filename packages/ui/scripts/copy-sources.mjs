/* After the bundle is built: ship the stylesheet, and plain copies of
   every component for `blurrow add` and `blurrow diff` to work from. */
import fs from "node:fs";
import path from "node:path";

const from = path.resolve("../../components/ui");
const dist = path.resolve("dist");
const registry = path.join(dist, "registry");

fs.mkdirSync(registry, { recursive: true });
fs.copyFileSync(path.join(from, "styles.css"), path.join(dist, "styles.css"));
let n = 0;
for (const f of fs.readdirSync(from)) {
  if (f === "index.ts" || !/\.(tsx?|css)$/.test(f)) continue;
  fs.copyFileSync(path.join(from, f), path.join(registry, f));
  n++;
}
fs.chmodSync(path.join(dist, "cli.js"), 0o755);
console.log(`copied ${n} source files to dist/registry`);
