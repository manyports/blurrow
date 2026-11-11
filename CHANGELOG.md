# changelog

everything that changed in blurrow, newest first. the shape follows [keep a changelog](https://keepachangelog.com/en/1.1.0/).

a note on numbers: the first commit is called "blurrow 1.0", but the package on npm is at 0.3.0. the versions below are the npm ones, since that's what people install.

## 0.3.0 (2026-11-11)

### added

- input: a `layered` variant that sits in a button's bezel, so a field and a button line up side by side ([#1](https://github.com/manyports/blurrow/pull/1)). it comes with a new example, "layered, next to a button".
- `--knob`: the toggle's knob has its own colour now, so a theme can set it apart from other raised faces.

### changed

- dark theme, reworked: a deeper page, and edges drawn with faint light hairlines instead of black rings (which vanish on dark), so panels, cards and keys separate from what's behind them. the inverse key (primary buttons, checked boxes, inverse badges) is a clean pale key instead of a muddy grey one. fields and wells have a visible rim. a switched-on toggle keeps a pale knob instead of a dark one.
- light theme: `--ink-muted` and `--ink-faint` are a step darker, so they pass contrast on the grey page (4.5:1 and 3:1). fields have a faint resting edge.

### site

these don't change the package, only the website:

- metadata, open graph and twitter images, a sitemap, robots, a web manifest and app icons.
- vercel analytics.
- a new readme with pictures, and a fresh package readme.
- star counts on the landing page.
- dark mode on the landing page, not just the docs. the hero's instrument follows the page's theme until you pick a finish.
- a softer frame around component previews in dark mode.
- "how it's made" is a deck on every screen: the section pins and the four steps slide across as you scroll, each holding still long enough to read, beside a plate that changes with them.
- "the parts" on a phone is a stack of cards: each part pins under the header and the next slides up over it, while the one beneath steps back.
- a new header, the same on every screen: a floating bar with the links in a well and a sliding thumb, a search field and the theme key, on every page. on a phone it's the name and a wide menu key, with search and a light / dark / auto switch inside the menu.

## 0.2.0 (2026-10-30)

### added

- the cli: `npx @blurrow/ui init`, `add`, `list`, `diff` and `doctor`, with `--yes`, `--dry-run` and `--cwd`. `blurrow` works as a shorter name once the package is installed.
- the package ships plain copies of every component in `dist/registry`, which `add` and `diff` work from.

published a minute after the commit "landing page updates & npm package" (d4c2948), so that's what it should contain.

## 0.1.0 (2026-10-30)

### added

- the first npm release of `@blurrow/ui`: the components, their types and `styles.css`, built with tsup from `components/ui`.

this was published about ten minutes before the commit that adds `packages/ui` ("landing page fixes & npm support", 18500e4), so it came from a working copy. exactly what went into it can't be told from the history.

## 0.0.0-stage (2026-10-30)

a test publish, a minute before 0.1.0. not meant to be installed.

## before npm

### added

- "blurrow 1.0" (84ad262): the docs site and 48 components, each with a page, examples and its source, plus the design tokens in `styles.css`.
