# @blurrow/ui

buttons you want to press, fields you want to fill in.

48 react components that share the same materials and the same light. made with care by [@manyports](https://manyports.com).

## install

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

## license

MIT
