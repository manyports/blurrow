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

## License

MIT. See [LICENSE](LICENSE).
