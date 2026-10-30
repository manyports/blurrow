import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CollapsibleCode } from "@/components/docs/CollapsibleCode";
import { ComponentPreview } from "@/components/docs/ComponentPreview";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { Pager } from "@/components/docs/Pager";
import { H2, H3, InlineCode, P, PageTitle, TextLink } from "@/components/docs/Prose";
import { examples } from "@/examples";
import { getEntry, getNeighbours, registry } from "@/lib/registry";
import { pkg } from "@/lib/site";
import { getComponentFiles, getExports, getPropTypes, readExample } from "@/lib/source";

/* Components that need a bigger stage than a button does */
const LARGE_STAGE = new Set(["card", "card-shell", "carousel", "table", "sidebar", "spotlight-card", "stat-card", "stat", "skeleton"]);

export function generateStaticParams() {
  return registry.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return entry ? { title: entry.name, description: entry.description } : {};
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const files = await getComponentFiles(entry.file);
  const [main, ...deps] = files;
  const exported = getExports(main.code).filter((n) => /^[A-Z]|^use/.test(n));
  const propTypes = getPropTypes(main.code);
  const sources = await Promise.all(entry.examples.map((e) => readExample(e.name)));
  const [hero, ...rest] = entry.examples;
  const Hero = examples[hero.name];
  const stage = LARGE_STAGE.has(slug) ? "lg" : "md";
  const { prev, next } = getNeighbours(slug);

  const toc = [
    { key: "installation", label: "installation", level: 1 as const },
    { key: "usage", label: "usage", level: 1 as const },
    ...(rest.length
      ? [
          { key: "examples", label: "examples", level: 1 as const },
          ...rest.map((e) => ({ key: e.name, label: e.title, level: 2 as const })),
        ]
      : []),
    ...(propTypes ? [{ key: "api", label: "props", level: 1 as const }] : []),
  ];

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-12">
      <article className="min-w-0 flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Breadcrumb
            items={[
              { label: "docs", href: "/docs" },
              { label: "components", href: "/docs/components" },
              { label: entry.name },
            ]}
          />
          <PageTitle
            eyebrow={
              <div className="flex gap-1.5">
                <Badge variant="muted">{entry.category}</Badge>
                {main.code.startsWith('"use client"') && <Badge variant="muted">client</Badge>}
              </div>
            }
            title={entry.name}
            description={entry.description}
          />
        </div>

        <ComponentPreview name={hero.name} code={sources[0]} size={stage}>
          <Hero />
        </ComponentPreview>

        <section className="flex flex-col gap-5">
          <H2 id="installation">installation</H2>
          <P>
            new to blurrow? this sets up your project in one go: the package, the styles and the font. already done it?
            skip straight to usage. the <TextLink href="/docs/installation">installation page</TextLink> has the
            details.
          </P>
          <CodeBlock language="bash" code={`npx ${pkg} init`} />
          <details className="group flex flex-col gap-4">
            <summary className="cursor-pointer list-none text-[14px] font-medium text-neutral-900 flex items-center gap-2 select-none">
              <span className="text-neutral-400 transition-transform duration-200 group-open:rotate-90">›</span>
              rather own the code? copy the source instead
            </summary>
            <div className="flex flex-col gap-4 pt-4">
              <P>let the cli copy it, along with anything it needs:</P>
              <CodeBlock language="bash" code={`npx ${pkg} add ${entry.slug}`} />
              <P>
                or by hand: drop {files.length > 1 ? "these files" : "this file"} into{" "}
                <InlineCode>components/ui</InlineCode> and import from there.
                {deps.length > 0 && (
                  <>
                    {" "}
                    {entry.name} leans on{" "}
                    {deps.map((d, i) => (
                      <span key={d.name}>
                        {i > 0 && (i === deps.length - 1 ? " and " : ", ")}
                        <InlineCode>{d.name}</InlineCode>
                      </span>
                    ))}
                    , so those come along too.
                  </>
                )}
              </P>
              {files.map((f) => (
                <CollapsibleCode key={f.name} title={`components/ui/${f.name}`} code={f.code.trimEnd()} />
              ))}
            </div>
          </details>
        </section>

        <section className="flex flex-col gap-5">
          <H2 id="usage">usage</H2>
          <CodeBlock language="tsx" code={`import { ${exported.join(", ")} } from "${pkg}";`} />
          <CodeBlock language="tsx" code={entry.usage} />
        </section>

        {rest.length > 0 && (
          <section className="flex flex-col gap-8">
            <H2 id="examples">examples</H2>
            {rest.map((e, i) => {
              const Example = examples[e.name];
              return (
                <div key={e.name} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <H3 id={e.name}>{e.title}</H3>
                    {e.description && <P>{e.description}</P>}
                  </div>
                  <ComponentPreview name={e.name} code={sources[i + 1]} size={stage}>
                    <Example />
                  </ComponentPreview>
                </div>
              );
            })}
          </section>
        )}

        {propTypes && (
          <section className="flex flex-col gap-5">
            <H2 id="api">props</H2>
            <P>straight from the source, so they&apos;re always up to date.</P>
            <CodeBlock language="ts" title="props" code={propTypes} />
          </section>
        )}

        <Pager
          prev={prev && { title: prev.name, href: `/docs/components/${prev.slug}` }}
          next={next && { title: next.name, href: `/docs/components/${next.slug}` }}
        />
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-[100px]">
          <OnThisPage items={toc} />
        </div>
      </aside>
    </div>
  );
}
