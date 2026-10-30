# blurrow/ui

The component kit from `../blogs`, as a browsable library — shadcn-style: one page per component with a live preview, its source, examples and props. Copy files into your app instead of installing a package.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Layout

- `components/ui/` — the library (copied from `blogs/app/components/ui`)
- `app/globals.css` — the design tokens (materials, shadows, keyframes)
- `lib/registry.ts` — the catalogue: one entry per component, with its examples
- `examples/` — one file per example; the page shows each file's source under **Code**
- `components/docs/` — the docs site's own chrome (header, nav, preview, TOC)

## Adding a component

1. Drop it in `components/ui/`.
2. Add examples to `examples/` and register them in `examples/index.ts`.
3. Add an entry to `lib/registry.ts`. The page, install files (with local dependencies), import line and API reference are generated from the source.

## The npm package

`packages/ui` publishes `components/ui` as `@blurrow/ui`, so the docs and the package always share one source.

- `components/ui/index.ts` exports everything; add a line when you add a component.
- `components/ui/styles.css` holds the tokens and ships as `@blurrow/ui/styles.css`. Site-only CSS stays in `app/globals.css`.

```bash
npm run package:build     # bundle to packages/ui/dist (esm + types + styles.css)
npm run package:publish   # publish to npm (runs the build first)
```

Bump `version` in `packages/ui/package.json` before each publish.

## License

MIT. See [LICENSE](LICENSE).
