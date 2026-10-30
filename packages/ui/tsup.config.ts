import fs from "node:fs";
import { defineConfig } from "tsup";

const { version } = JSON.parse(fs.readFileSync("package.json", "utf8"));

export default defineConfig([
  /* The library: one bundle from the components the docs site renders,
     so what ships is exactly what's documented. Nearly every component
     uses state or effects, so the whole bundle is marked as client
     code; server components can still import from it.               */
  {
    entry: { index: "../../components/ui/index.ts" },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2020",
    tsconfig: "tsconfig.json",
    external: ["react", "react-dom", "react/jsx-runtime"],
    banner: { js: '"use client";' },
  },
  /* The CLI: plain node, no dependencies, the catalogue baked in */
  {
    entry: { cli: "cli/index.ts" },
    format: ["esm"],
    platform: "node",
    target: "node18",
    tsconfig: "tsconfig.json",
    banner: { js: "#!/usr/bin/env node" },
    define: { __VERSION__: JSON.stringify(version) },
  },
]);
