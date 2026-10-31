# contributing

thanks for wanting to help. bugs, new components, a shadow that's one pixel off: all welcome.

## running it

```bash
git clone https://github.com/manyports/blurrow
cd blurrow
npm install
npm run dev        # the docs site, at http://localhost:3000
```

before you open a pull request:

```bash
npm run lint
npx tsc --noEmit   # there's no typecheck script, so call tsc directly
npm run build      # the site still builds
```

## where things live

the repo is the docs site and the package at once, so the two can't drift apart.

| where | what lives there |
| --- | --- |
| [`components/ui/`](components/ui) | the components. this is what ships |
| [`components/ui/index.ts`](components/ui/index.ts) | what the package exports |
| [`components/ui/styles.css`](components/ui/styles.css) | the tokens: materials, shadows, keyframes |
| [`examples/`](examples) | one file per example. the docs show each file's source |
| [`examples/index.ts`](examples/index.ts) | maps each example name to its file |
| [`lib/registry.ts`](lib/registry.ts) | the catalogue the docs and the cli are built from |
| [`app/`](app) | the website |
| [`packages/ui/`](packages/ui) | the npm package and its cli |

## adding a component

1. put it in `components/ui/YourThing.tsx` and export it from `components/ui/index.ts`. mark it `"use client"` if it uses state or effects.
2. write a couple of examples in `examples/`, one per file, each with a default export: `your-thing-demo.tsx`, `your-thing-sizes.tsx` and so on. import from `@/components/ui/...`.
3. add them to `examples/index.ts`: the import and a line in the map. the comment at the top says it's generated, but there's no script for it yet, so do it by hand.
4. add an entry to `lib/registry.ts` under the right category:

```ts
{
  slug: "your-thing",
  name: "your thing",
  category: "forms",
  description: "one short line, lowercase, in the same voice as the others.",
  file: "YourThing",                  // the file in components/ui, no extension
  usage: `<YourThing />`,
  examples: [
    ex("your-thing-demo", "default"), // the first one is the page's preview
    ex("your-thing-sizes", "sizes"),
  ],
},
```

that's it. the page at `/docs/components/your-thing`, the install instructions and the props table all come from the source. the cli reads the same registry, so `npx @blurrow/ui add your-thing` works too.

adding an example to a component that already exists is steps 2 to 4.

## the design rules

these are what make the parts hold together. a pull request that breaks one will get asked to change.

- **one light source, right above the screen.** highlights on top edges, shade on bottom edges. nothing is lit from the side or from below.
- **raised means press, sunken means fill.** buttons, toggles and anything else you press are a face sitting in a bezel. fields you type into are cut into the surface.
- **a face and a bezel.** the bezel never moves. the face lifts a pixel on hover and sinks flush on press.
- **tokens live in `styles.css`.** use the existing materials (`--bezel-light`, `--face-light`, `--field`, `--well`, the card and panel tokens, and their dark versions) instead of writing new shadows inline. if you need a new one, add it there, with every state built from the same layers so it animates instead of snapping (the field tokens show how).
- **light and dark agree.** a dark face uses the dark tokens and casts the same shadow as a light one.
- **lowercase, plain words.** labels, descriptions and docs copy are lowercase and short.
- **no new dependencies** in the components without asking first.

## the package

`packages/ui` builds the npm package with [tsup](https://tsup.egoist.dev) ([`tsup.config.ts`](packages/ui/tsup.config.ts)):

- one esm bundle from `components/ui/index.ts`, with types, marked `"use client"`.
- the cli from [`packages/ui/cli/`](packages/ui/cli), with the registry baked in.
- then [`copy-sources.mjs`](packages/ui/scripts/copy-sources.mjs) copies `styles.css` and plain copies of every component into `dist/`, for `add` and `diff`.

```bash
npm run package:build
```

you don't need to bump the version or publish. that happens when a release goes out.

## what a pull request should have

- the change itself, small and about one thing.
- an example in `examples/` for anything new you can see, added to `examples/index.ts` and `lib/registry.ts`.
- lint and `tsc` passing, and the site building.
- a screenshot or a short clip if it changes how something looks.
- a line under "unreleased" in [`CHANGELOG.md`](CHANGELOG.md).

## license

by contributing you agree your work is shared under the [mit license](LICENSE), like the rest of blurrow.
