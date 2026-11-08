import Link from "next/link";
import { Caveat } from "next/font/google";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Tabs } from "@/components/ui/Tabs";
import { JsonLd } from "@/components/docs/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { Finale } from "@/components/landing/Finale";
import { Hero } from "@/components/landing/Hero";
import { HowItsMade } from "@/components/landing/HowItsMade";
import { OpenSource } from "@/components/landing/OpenSource";
import { examples } from "@/examples";
import { getEntry, registry } from "@/lib/registry";
import { getStars } from "@/lib/github";
import { authorLd } from "@/lib/seo";
import { initCommand, npmUrl, pkg, repo, siteDescription, siteName, siteUrl } from "@/lib/site";

/* The parts case: a raised case with sunken compartments, each holding a
   live part, sized to what's in it. Spans are 12ths on large screens. */
const parts: { slug: string; example: string; span: string }[] = [
  { slug: "radio-cards", example: "radio-cards-demo", span: "lg:col-span-5 lg:row-span-2" },
  { slug: "otp-input", example: "otp-input-demo", span: "lg:col-span-7" },
  { slug: "slider", example: "slider-range", span: "lg:col-span-4" },
  { slug: "toggle", example: "toggle-with-description", span: "lg:col-span-3" },
  { slug: "color-picker", example: "color-picker-inline", span: "lg:col-span-4 lg:row-span-2" },
  { slug: "button", example: "button-variants", span: "lg:col-span-8" },
  { slug: "tabs", example: "tabs-segmented", span: "lg:col-span-4" },
  { slug: "date-picker", example: "date-picker-demo", span: "lg:col-span-4" },
  { slug: "file-upload", example: "file-upload-demo", span: "lg:col-span-7" },
  { slug: "stat-card", example: "stat-card-demo", span: "lg:col-span-5" },
];

/* The pencil the page's drawings and notes are written in. Self-hosted
   at build time, and only this page asks for it.                  */
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", weight: ["500", "600"] });

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium text-neutral-500">{children}</p>;
}

function Title({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={["text-[clamp(36px,5vw,64px)] font-medium leading-[1] tracking-[-0.05em] text-neutral-900 text-balance", className].join(" ")}>
      {children}
    </h2>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return <p className="max-w-[42ch] text-[17px] leading-[1.6] text-neutral-600 text-pretty">{children}</p>;
}

export default async function Home() {
  const stars = await getStars();
  const count = registry.length;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: siteName, alternateName: "blurrow/ui", description: siteDescription, inLanguage: "en", publisher: authorLd },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${siteUrl}/#code`,
        name: siteName,
        description: siteDescription,
        url: siteUrl,
        codeRepository: repo.url,
        programmingLanguage: ["TypeScript", "React", "CSS"],
        runtimePlatform: "React 19 and Tailwind CSS v4",
        license: "https://opensource.org/licenses/MIT",
        author: authorLd,
        isAccessibleForFree: true,
        sameAs: [repo.url, npmUrl],
        ...(stars ? { interactionStatistic: { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: stars } } : {}),
        targetProduct: { "@type": "SoftwareApplication", name: pkg, applicationCategory: "DeveloperApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <main className={["mx-auto max-w-[1240px] px-4 sm:px-6", hand.variable].join(" ")}>
        <Hero />

        {/* ── One object, taken through how it's made ──────────── */}
        <section id="how-its-made" className="scroll-mt-24 pt-28 sm:pt-40">
          <div className="flex flex-col gap-5 lg:max-w-[58%]">
            <Eyebrow>how it&apos;s made</Eyebrow>
            <Title>bezels, faces, and one lamp. that&apos;s the kit.</Title>
          </div>
          <div className="mt-6 lg:mt-0">
            <HowItsMade />
          </div>
        </section>

        {/* ── The parts case ───────────────────────────────────── */}
        <section id="favourites" className="scroll-mt-24 pt-24 sm:pt-32">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
            <div className="flex flex-col gap-5">
              <Eyebrow>the parts</Eyebrow>
              <Title>{count} parts. one case.</Title>
            </div>
            <div className="flex flex-col gap-4">
              <Lede>
                because they&apos;re all cut from the same materials, any two look like they came out of the same box. here
                are ten, working. the rest are in the docs, each with its source.
              </Lede>
              <Link href="/docs/components" className="link-slide self-start text-[15px] font-medium text-neutral-900">
                open the whole case →
              </Link>
            </div>
          </div>

          {/* A raised case; every compartment is a well with a part resting in it */}
          <div
            className="mt-12 rounded-[34px] p-2.5 sm:mt-16 sm:p-3"
            style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
          >
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-12">
              {parts.map((p) => {
                const entry = getEntry(p.slug)!;
                const Example = examples[p.example];
                return (
                  <div
                    key={p.slug}
                    className={["group/part relative flex flex-col rounded-[24px] p-5 sm:p-6", p.span].join(" ")}
                    style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
                  >
                    <div className="flex min-h-[170px] flex-1 items-center justify-center py-8">
                      <Example />
                    </div>
                    {/* stamped into the floor of the compartment */}
                    <Link
                      href={`/docs/components/${p.slug}`}
                      className="flex items-center justify-between gap-3 rounded-[8px] text-[12.5px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                      style={{ textShadow: "0 1px 0 rgba(255,255,255,0.85)" }}
                    >
                      {entry.name}
                      <span aria-hidden className="opacity-0 transition-[opacity,transform] duration-300 group-hover/part:translate-x-0.5 group-hover/part:opacity-100">
                        →
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Getting it ───────────────────────────────────────── */}
        <section id="install" className="scroll-mt-24 pt-28 sm:pt-40">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="flex flex-col gap-5">
              <Eyebrow>getting it</Eyebrow>
              <Title>one command. or the source.</Title>
              <Lede>
                take it as a package, or copy the parts you want into your own repo and bend them. the cli does both, and
                never writes over a file you&apos;ve changed. react 19, tailwind v4, no runtime dependencies.
              </Lede>
            </div>
            <div className="lg:pt-3">
              <Tabs
                tabs={[
                  {
                    key: "package",
                    label: "as a package",
                    content: (
                      <CodeBlock
                        language="bash"
                        title="terminal"
                        code={`${initCommand}\n# installs it, adds the styles, the font and toasts\n\n# then, anywhere:\n# import { Button } from "${pkg}";`}
                      />
                    ),
                  },
                  {
                    key: "source",
                    label: "as source you own",
                    content: (
                      <CodeBlock
                        language="bash"
                        title="terminal"
                        code={`npx ${pkg} add button date-picker toast\n# copies them in, with anything they lean on\n\nnpx ${pkg} diff\n# shows what you've changed since`}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="pt-28 sm:pt-40">
          <OpenSource stars={stars} />
        </section>

        {/* ── The end ──────────────────────────────────────────── */}
        <section id="get-started" className="scroll-mt-24 pb-28 pt-32 sm:pt-44">
          <Finale command={initCommand} />
        </section>
      </main>

      <Footer />
    </>
  );
}
