# @blurrow/ui

buttons you want to press, fields you want to fill in.

48 react components that share the same materials and the same light. made with care by [@manyports](https://manyports.com).

## install

the quick way, in your project:

```bash
npx @blurrow/ui init
```

it installs the package, adds the styles to your css, loads the font and sets up toasts in your layout, showing each change before it makes it. or by hand:

```bash
npm install @blurrow/ui
```

you'll need react 19 and tailwind css v4.

## set up

**1. styles.** add the tokens to your global stylesheet, after tailwind, and point tailwind at the package so it picks up the classes the components use:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@blurrow/ui/styles.css";

@source "../node_modules/@blurrow/ui";
```

the `@source` path is relative to the css file, so adjust it if your stylesheet lives somewhere else.

**2. font.** everything is set in archivo. load it as the `--font-archivo` variable. with next.js:

```tsx
// app/layout.tsx
import { Archivo } from "next/font/google";
import { ToastProvider } from "@blurrow/ui";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="bg-[#EBEBEB] font-sans text-neutral-900 antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

`ToastProvider` is only needed if you use toasts.

## use

```tsx
import { Button } from "@blurrow/ui";

export default function Page() {
  return <Button variant="primary">say hi</Button>;
}
```

every component is marked `"use client"`, so you can import them straight into server components.

## the cli

```bash
npx @blurrow/ui init            # set up a project (safe to run again)
npx @blurrow/ui add [names…]    # copy components' source in, with anything they need
npx @blurrow/ui list            # every component, and which ones you've copied
npx @blurrow/ui diff [name]     # what you've changed in copied components
npx @blurrow/ui doctor [--fix]  # check the setup, and repair the css if it's off
```

once the package is installed, `npx blurrow <command>` is a shorter way to say the same thing.

`add` with no names opens a picker (type to filter, space to pick). names are forgiving: `button`, `Button` and `button-group` all work, and typos get a suggestion. copied files that you've changed are never overwritten unless you pass `--overwrite`.

everything takes `--yes` (no questions), `--dry-run` (show, don't write) and `--cwd <path>`. settings live in `blurrow.json`:

```json
{ "componentsDir": "components/ui", "css": "app/globals.css" }
```

## license

MIT
