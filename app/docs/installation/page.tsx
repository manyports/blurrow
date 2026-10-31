import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CollapsibleCode } from "@/components/docs/CollapsibleCode";
import { Pager } from "@/components/docs/Pager";
import { H2, InlineCode, P, PageTitle, TextLink } from "@/components/docs/Prose";
import { JsonLd } from "@/components/docs/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { pkg } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Install blurrow in a React and Tailwind project",
  description:
    "Set up blurrow with one command, or by hand: install the package, add its styles to your CSS, load the Archivo font and wrap your app in ToastProvider.",
  path: "/docs/installation",
  imageAlt: "The blurrow banner, with the setup command npx @blurrow/ui init.",
});

const css = `@import "tailwindcss";
@import "${pkg}/styles.css";

/* let tailwind see the classes the components use */
@source "../node_modules/${pkg}";`;

const layout = `import { Archivo } from "next/font/google";
import { ToastProvider } from "${pkg}";
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
}`;

const themeHtml = `<!-- the whole page -->
<html lang="en" data-theme="dark">

<!-- or one part of it -->
<section data-theme="dark">…</section>`;

const themeToggle = `// follow the reader's system setting until they choose
document.documentElement.dataset.theme = "system";

// then their choice wins
document.documentElement.dataset.theme = dark ? "dark" : "light";`;

const rebrand = `/* after the kit's styles, with the same selectors it uses */
:root,
[data-theme="light"] {
  --page: #eeece8;
  --ink: #1c1917;
}
.dark,
[data-theme="dark"] {
  --page: #0c0a09;
  --ink: #f5f5f4;
}`;

const usage = `import { Button } from "${pkg}";

export default function Page() {
  return <Button variant="primary">say hi</Button>;
}`;

function Step({ n, id, title, children }: { n: number; id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative flex flex-col gap-4 pl-11">
      <span
        aria-hidden
        className="absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold text-ink-body tabular-nums"
        style={{ background: "var(--face)", boxShadow: "var(--tile-shadow)" }}
      >
        {n}
      </span>
      <H2 id={id}>{title}</H2>
      {children}
    </section>
  );
}

export default async function InstallationPage() {
  const tokens = (await fs.readFile(path.join(process.cwd(), "components", "ui", "styles.css"), "utf8")).trimEnd();

  return (
    <article className="max-w-3xl flex flex-col gap-12">
      <JsonLd
        data={breadcrumbLd([
          { name: "home", path: "/" },
          { name: "docs", path: "/docs" },
          { name: "installation", path: "/docs/installation" },
        ])}
      />
      <PageTitle
        title="installation"
        description="a few minutes of setup, then you can use any component. you'll need react 19 and tailwind css v4."
      />

      <section className="flex flex-col gap-4">
        <H2 id="quick">the quick way</H2>
        <P>
          run this in your project. it installs the package, adds the styles to your css, loads the font and sets up
          toasts in your layout, showing you each change before it makes it.
        </P>
        <CodeBlock language="bash" code={`npx ${pkg} init`} />
        <P>
          later, <InlineCode>npx {pkg} doctor</InlineCode> checks everything&apos;s still wired up, and{" "}
          <InlineCode>npx {pkg} doctor --fix</InlineCode> repairs your stylesheet if it isn&apos;t. rather do it by
          hand? here&apos;s what init does:
        </P>
      </section>

      <Step n={1} id="install" title="install the package">
        <CodeBlock language="bash" code={`npm install ${pkg}`} />
      </Step>

      <Step n={2} id="styles" title="add the styles">
        <P>
          the components get their look from a small set of css tokens. pull them into your global stylesheet, and point
          tailwind at the package so it picks up the classes the components use.
        </P>
        <CodeBlock language="css" title="app/globals.css" code={css} />
      </Step>

      <Step n={3} id="font" title="set up the font and toasts">
        <P>
          everything is set in archivo. load it as <InlineCode>--font-archivo</InlineCode> and the tokens take it from
          there. if you&apos;ll use toasts, wrap your app in <InlineCode>ToastProvider</InlineCode> too.
        </P>
        <CodeBlock language="tsx" title="app/layout.tsx" code={layout} />
      </Step>

      <Step n={4} id="use" title="use it">
        <P>
          that&apos;s it! import whatever you need. each <TextLink href="/docs/components">component page</TextLink>{" "}
          has examples to copy from.
        </P>
        <CodeBlock language="tsx" title="app/page.tsx" code={usage} />
      </Step>

      <section className="flex flex-col gap-4 pt-4">
        <H2 id="dark-mode">dark mode</H2>
        <P>
          every colour, shadow and gradient the components use is a css variable, with a light set and a dark set. light
          is the default. to go dark, put <InlineCode>data-theme=&quot;dark&quot;</InlineCode> on{" "}
          <InlineCode>&lt;html&gt;</InlineCode>, or on any element to darken just that part. the lamp stays where it
          was: top edges still catch the light, and fields still sit below the surface.
        </P>
        <CodeBlock language="html" code={themeHtml} />
        <P>
          the class <InlineCode>dark</InlineCode> does the same, if your theme switcher toggles a class (next-themes,
          tailwind&apos;s class strategy). to follow the reader&apos;s system setting, use{" "}
          <InlineCode>data-theme=&quot;system&quot;</InlineCode>. an explicit <InlineCode>light</InlineCode> or{" "}
          <InlineCode>dark</InlineCode> always wins, so a toggle can override it, and{" "}
          <InlineCode>data-theme=&quot;light&quot;</InlineCode> keeps a part of the page light inside a dark one.
        </P>
        <CodeBlock language="ts" code={themeToggle} />
        <P>
          your own page can follow along with the same tokens: <InlineCode>bg-page</InlineCode> and{" "}
          <InlineCode>text-ink</InlineCode> in the layout above, and <InlineCode>text-ink-muted</InlineCode>,{" "}
          <InlineCode>bg-panel-face</InlineCode>, <InlineCode>border-line</InlineCode> and friends anywhere else. the
          cards&apos; <InlineCode>theme=&quot;dark&quot;</InlineCode> and the buttons&apos;{" "}
          <InlineCode>tone=&quot;dark&quot;</InlineCode> still work: they keep that one object in the dark material,
          whatever the page is doing.
        </P>
        <P>
          to make it yours, override the variables after the kit&apos;s styles, with the same selectors it uses. the
          full list is in the stylesheet below.
        </P>
        <CodeBlock language="css" title="app/globals.css" code={rebrand} />
      </section>

      <section className="flex flex-col gap-4 pt-4">
        <H2 id="copy">rather copy the source?</H2>
        <P>
          that works too. <InlineCode>npx {pkg} add button tabs</InlineCode> copies components (and anything they need)
          into your project and wires up the tokens; run it with no names to pick from a list.{" "}
          <InlineCode>npx {pkg} diff</InlineCode> shows what you&apos;ve changed since. or do it by hand: every component
          page has its full source under &ldquo;rather own the code?&rdquo;. drop the
          files into <InlineCode>components/ui</InlineCode>, save the tokens below as{" "}
          <InlineCode>components/ui/styles.css</InlineCode>, and import it right after tailwind in your{" "}
          <InlineCode>globals.css</InlineCode> in place of step 2.
        </P>
        <CollapsibleCode title="components/ui/styles.css" language="css" code={tokens} />
      </section>

      <Pager
        prev={{ title: "introduction", href: "/docs" }}
        next={{ title: "all components", href: "/docs/components" }}
      />
    </article>
  );
}
