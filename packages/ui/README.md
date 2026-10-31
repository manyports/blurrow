<a href="https://www.blurrow.org">
  <img src="https://raw.githubusercontent.com/manyports/blurrow/main/.github/readme/banner.png" alt="blurrow/ui: buttons you want to press, fields you want to fill in" width="100%">
</a>

# @blurrow/ui

48 react components that look and feel like physical things. buttons sit in a bezel and sink when you press them, text fields are cut into the surface, and every shadow agrees on where the light is coming from.

free, mit licensed, and built for react 19 and tailwind css v4. made with care by [@manyports](https://manyports.com).

**[website](https://www.blurrow.org)** · [docs](https://www.blurrow.org/docs) · [all components](https://www.blurrow.org/docs/components) · [github](https://github.com/manyports/blurrow)

<img src="https://raw.githubusercontent.com/manyports/blurrow/main/.github/readme/favourites.png" alt="nine blurrow components: buttons, toggles, an input, tabs, pagination, a radio group, a select, a stat card and an alert" width="100%">

## getting started

```bash
npx @blurrow/ui init
```

that's the whole setup. it installs the package, adds two lines to your stylesheet, loads the archivo font and wraps your app in `ToastProvider`, showing you each change before it writes anything.

<img src="https://raw.githubusercontent.com/manyports/blurrow/main/.github/readme/cli.png" alt="the blurrow cli setting up a next.js project" width="560">

then use whatever you like:

```tsx
import { Button, Input, Toggle } from "@blurrow/ui";

export default function Settings() {
  return (
    <form className="flex flex-col gap-4">
      <Input label="display name" placeholder="ada" />
      <Toggle label="email me when someone replies" defaultChecked />
      <Button variant="primary">save</Button>
    </form>
  );
}
```

they drop straight into server components. the interactive ones are marked `"use client"`, and the static ones (badges, cards, avatars, skeletons…) render on the server and send no javascript.

## setting it up by hand

if you'd rather not run `init`, it does four things:

**1. install**

```bash
npm install @blurrow/ui
```

**2. styles.** add the tokens after tailwind, and let tailwind see the classes the components use. the `@source` path is relative to your css file.

```css
/* app/globals.css */
@import "tailwindcss";
@import "@blurrow/ui/styles.css";

@source "../node_modules/@blurrow/ui";
```

**3. font.** everything is set in archivo, loaded as the `--font-archivo` variable. with next.js:

```tsx
// app/layout.tsx
import { Archivo } from "next/font/google";
import { ToastProvider } from "@blurrow/ui";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="bg-page font-sans text-ink antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

**4. toasts.** `ToastProvider` above is only needed if you use `useToast()`.

## dark mode

every colour, shadow and gradient is a css variable with a light and a dark value. put `data-theme="dark"` on `<html>` (or the class `dark`), or on any element to darken just that part. `data-theme="system"` follows the os setting, and an explicit `light` or `dark` always wins. `bg-page` and `text-ink` let your own page follow along. more in [the docs](https://www.blurrow.org/docs/installation#dark-mode).

## the cli

```bash
npx @blurrow/ui init            # set up a project, safe to run again
npx @blurrow/ui add [names…]    # copy components' source in, with anything they need
npx @blurrow/ui list            # every component, and which ones you've copied
npx @blurrow/ui diff [name]     # what you've changed in your copies
npx @blurrow/ui doctor [--fix]  # check the setup, and repair the css if it's off
```

`add` with no names opens a picker: type to filter, space to choose. names are forgiving (`button`, `Button` and `button-group` all work) and typos get a suggestion. files you've edited are never overwritten unless you pass `--overwrite`.

everything takes `--yes`, `--dry-run` and `--cwd <path>`. settings live in `blurrow.json`. once the package is installed, `npx blurrow` works as a shorter name.

## license

mit. issues and ideas are welcome on [github](https://github.com/manyports/blurrow/issues).
