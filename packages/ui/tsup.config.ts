import fs from "node:fs";
import { defineConfig } from "tsup";
import type { Plugin } from "esbuild";

/* "./Button" inside a component becomes "./Button.js" in the output and
   isn't inlined: inlining would copy a client component into a file
   without the directive, and node-style resolvers need the extension. */
const siblingsStayImports: Plugin = {
  name: "siblings-stay-imports",
  setup(build) {
    build.onResolve({ filter: /^\.\/[^/]+$/ }, (args) => ({
      path: `${args.path}.js`,
      external: true,
    }));
  },
};

const { version } = JSON.parse(fs.readFileSync("package.json", "utf8"));

export default defineConfig([
  /* The library: one output file per component from the components the
     docs site renders, so what ships is exactly what's documented. Each
     file keeps its own "use client" (or lack of one), so the static parts
     render on the server and only the interactive ones reach the browser.
     Imports between components stay imports, pointed at the built file. */
  {
    entry: ["../../components/ui/*.ts", "../../components/ui/*.tsx"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2020",
    tsconfig: "tsconfig.json",
    external: ["react", "react-dom", "react/jsx-runtime"],
    esbuildPlugins: [siblingsStayImports],
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
