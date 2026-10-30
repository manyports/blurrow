import type { Metadata } from "next";
import { Pager } from "@/components/docs/Pager";
import { H2, InlineCode, P, PageTitle, TextLink } from "@/components/docs/Prose";
import { JsonLd } from "@/components/docs/JsonLd";
import { registry } from "@/lib/registry";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { initCommand, npmUrl, repo } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "introduction",
  description: `what blurrow/ui is and how it's made: ${registry.length} tactile react components for tailwind css v4, with one material and one light source. open source and mit licensed.`,
  path: "/docs",
});

const principles = [
  {
    title: "one light source",
    body: "every shadow assumes the light is right above the screen. top edges are lit, bottom edges sit in shade, and raised bits cast onto whatever holds them.",
  },
  {
    title: "raised and sunken",
    body: "things you press, like buttons and tab thumbs, sit above the surface. things you fill in, like inputs and tracks, sit below it.",
  },
  {
    title: "bezel and face",
    body: "buttons, cards, code blocks and menus are all built the same way. a bezel stays still and holds a face, and the face is the part that moves.",
  },
  {
    title: "motion",
    body: "when a control changes, the bit that changed slides to its new spot. if you've turned on reduced motion, everything just goes straight there.",
  },
];

export default function IntroductionPage() {
  return (
    <article className="max-w-3xl flex flex-col gap-10">
      <JsonLd data={breadcrumbLd([{ name: "home", path: "/" }, { name: "introduction", path: "/docs" }])} />
      <PageTitle
        title="introduction"
        description={`hi! blurrow/ui is ${registry.length} react components that share the same materials and the same light. they're meant to feel nice to press, type into and look at.`}
      />

      <section className="flex flex-col gap-4">
        <H2 id="what">what it is</H2>
        <P>
          it started as the kit behind blogs and grew into its own thing. every component is built with react and
          tailwind css v4, and gets its look from a small set of css tokens (gradients and layered shadows).
        </P>
        <P>
          run <InlineCode>{initCommand}</InlineCode> in your project and it sets everything up: the package, the
          styles, the font. then import what you need. if you&apos;d rather tweak a component yourself,{" "}
          <InlineCode>npx @blurrow/ui add button</InlineCode> copies its source in. the{" "}
          <TextLink href="/docs/installation">installation page</TextLink> has the details.
        </P>
        <P>
          it&apos;s open source under the mit license, on{" "}
          <a href={repo.url} target="_blank" rel="noopener" className="link-slide font-medium text-neutral-900">
            github
          </a>{" "}
          and{" "}
          <a href={npmUrl} target="_blank" rel="noopener" className="link-slide font-medium text-neutral-900">
            npm
          </a>
          . issues, ideas and pull requests are all welcome.
        </P>
      </section>

      <section className="flex flex-col gap-5">
        <H2 id="principles">how it&apos;s made</H2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-[20px] p-1.5"
              style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
            >
              <div className="h-full rounded-[15px] bg-white p-5" style={{ boxShadow: "var(--panel-face-shadow)" }}>
                <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-neutral-900">{p.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-neutral-500">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Pager next={{ title: "installation", href: "/docs/installation" }} />
    </article>
  );
}
