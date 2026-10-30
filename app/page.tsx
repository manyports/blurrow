import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Anatomy } from "@/components/landing/Anatomy";
import { Footer } from "@/components/landing/Footer";
import { LightRig } from "@/components/landing/LightRig";
import { LightsOut } from "@/components/landing/LightsOut";
import { RaisedSunken } from "@/components/landing/RaisedSunken";
import { MotionDemo } from "@/components/landing/MotionDemo";
import { OpenSource } from "@/components/landing/OpenSource";
import { examples } from "@/examples";
import { getEntry, registry } from "@/lib/registry";
import { getStars } from "@/lib/github";
import { initCommand } from "@/lib/site";

/* Nine components on the sheet. Captions say what each one does when
   you use it, in the plainest words that are still true.            */
const specimens = [
  { slug: "button", example: "button-variants", note: "four flavours. the face lifts when you hover and sinks when you press." },
  { slug: "toggle", example: "toggle-with-description", note: "for settings that should kick in right away." },
  { slug: "input", example: "input-with-icon", note: "click in and the field rises to meet you." },
  { slug: "tabs", example: "tabs-segmented", note: "the thumb slides over to whichever tab you pick." },
  { slug: "pagination", example: "pagination-demo", note: "same well and thumb as the tabs, so they feel related." },
  { slug: "radio-group", example: "radio-group-demo", note: "the dot travels over to your choice." },
  { slug: "select", example: "select-demo", note: "looks like a field, opens a little panel of options." },
  { slug: "stat-card", example: "stat-card-demo", note: "counts up to its number when it shows up." },
  { slug: "alert", example: "alert-demo", note: "for telling people how things went, in four moods." },
];


function Heading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-[clamp(26px,2.8vw,34px)] font-medium leading-[1.1] tracking-[-0.035em] text-neutral-900">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-[15.5px] leading-[1.65] text-neutral-600 max-w-[46ch] text-pretty">{children}</p>;
}

/* Text on the left, the thing it describes on the right */
function Row({ title, children, figure }: { title: string; children: React.ReactNode; figure: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-14 py-12 border-t border-neutral-900/[0.08]">
      <div className="flex flex-col gap-3">
        <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">{title}</h3>
        {children}
      </div>
      <div className="min-w-0">{figure}</div>
    </div>
  );
}

export default async function Home() {
  const stars = await getStars();

  return (
    <>
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* ── Opening ──────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-center pt-14 sm:pt-20 pb-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-[clamp(38px,5vw,60px)] font-medium leading-[1.02] tracking-[-0.045em] text-balance">
              <span className="text-neutral-900">buttons you want to press,</span>{" "}
              <span className="text-neutral-400">fields you want to fill in.</span>
            </h1>
            <p className="flex items-center gap-2 text-[14px] tracking-[-0.005em]">
              <span className="font-medium text-neutral-900">blurrow/ui</span>
              <span aria-hidden className="w-1 h-1 rounded-full bg-neutral-300" />
              <a
                href="https://manyports.com"
                target="_blank"
                rel="noopener"
                className="link-slide text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                @manyports
              </a>
            </p>
            <Body>
              hi! this is the kit i made for blogs, now its own little library. it&apos;s {registry.length} react
              components that share the same materials and the same light, so everything you build with them feels like
              it belongs together.
            </Body>
          </div>
          <Anatomy />
        </section>

        {/* ── Specimen sheet ───────────────────────────────────── */}
        <section className="flex flex-col gap-8 pb-24">
          <div className="flex items-end justify-between gap-6">
            <Heading>a few favourites</Heading>
            <Link href="/docs/components" className="link-slide shrink-0 text-[14px] font-medium text-neutral-900">
              see all {registry.length}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-neutral-900/[0.08]">
            {specimens.map((s) => {
              const entry = getEntry(s.slug)!;
              const Example = examples[s.example];
              return (
                <div key={s.slug} className="flex flex-col border-r border-b border-neutral-900/[0.08] p-6">
                  <div className="flex-1 min-h-[150px] sm:min-h-[220px] flex items-center justify-center py-4 sm:py-6">
                    <Example />
                  </div>
                  <div className="flex flex-col gap-1 pt-4">
                    <Link
                      href={`/docs/components/${s.slug}`}
                      className="self-start text-[14px] font-medium text-neutral-900 hover:underline underline-offset-4 decoration-neutral-300"
                    >
                      {entry.name}
                    </Link>
                    <p className="text-[13px] leading-[1.5] text-neutral-500">{s.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How it's built ───────────────────────────────────── */}
        <section className="flex flex-col pb-12">
          <div className="pb-10">
            <Heading>how it&apos;s made</Heading>
          </div>

          <Row title="raised and sunken" figure={<RaisedSunken />}>
            <Body>
              if you can press it, it sits above the surface. if you can type into it, it sits below. that way you can tell
              a button from a text field before you&apos;ve read a single word.
            </Body>
            <Body>try it: name a draft and save it. it drops into the tray below, a raised thing resting in a well.</Body>
          </Row>

          <Row title="one light source" figure={<LightRig />}>
            <Body>
              every shadow in the kit pretends there&apos;s a lamp right above your screen. move it and you can see
              what it&apos;s doing: shadows fall away from it, and the edges facing it catch the light.
            </Body>
            <Body>
              in the kit it never moves, so a light card and a dark card cast the same shadow and get along fine on the
              same page.
            </Body>
          </Row>

          <Row title="moving, not blinking" figure={<MotionDemo />}>
            <Body>
              nothing in the kit pops into place. when something changes, it travels there, the way a real object
              would.
            </Body>
            <Body>
              pick a period. the tab&apos;s thumb slides over, every bar grows into its new height a beat after the one
              before it, and the total counts its way to the new number.
            </Body>
          </Row>
        </section>

        <OpenSource stars={stars} />

        {/* ── Using it: a dark room with a pull cord ───────────── */}
        <section className="pt-6 pb-16">
          <LightsOut>
            <h2 className="text-[clamp(32px,5vw,56px)] font-medium leading-[1.02] tracking-[-0.045em] text-neutral-900 text-balance">
              ready when you are!
            </h2>
            <p className="text-[16px] leading-[1.6] text-neutral-500 max-w-[40ch]">
              one command sets everything up, and the whole kit is yours to use :)
            </p>
            <div className="w-full max-w-md text-left">
              <CodeBlock language="bash" code={initCommand} />
            </div>
          </LightsOut>
        </section>
      </main>

      <Footer />
    </>
  );
}
