import { defineConfig } from "tsup";

/* One bundle from the components the docs site renders, so what ships is
   exactly what's documented. Nearly every component uses state or
   effects, so the whole bundle is marked as client code; server
   components can still import from it.                               */
export default defineConfig({
  entry: { index: "../../components/ui/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  tsconfig: "tsconfig.json",
  external: ["react", "react-dom", "react/jsx-runtime"],
  banner: { js: '"use client";' },
});
