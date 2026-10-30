import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/docs/Prose";
import { JsonLd } from "@/components/docs/JsonLd";
import { entriesByCategory, registry } from "@/lib/registry";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "components",
  description: `all ${registry.length} blurrow/ui react components, from buttons, inputs and selects to modals, toasts, tables and cards. each with a live preview, examples and source.`,
  path: "/docs/components",
});

export default function ComponentsIndexPage() {
  return (
    <div className="flex flex-col gap-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "blurrow/ui components",
          numberOfItems: registry.length,
          itemListElement: registry.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: e.name,
            url: `${siteUrl}/docs/components/${e.slug}`,
          })),
        }}
      />
      <PageTitle
        title="components"
        description={`all ${registry.length} of them, grouped by what they're for. every page has a live preview, a few examples and the source.`}
      />

      {entriesByCategory().map(({ category, entries }) => (
        <section key={category} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-neutral-900">{category}</h2>
            <span className="text-[13px] text-neutral-400 tabular-nums">{entries.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {entries.map((e) => (
              <Link
                key={e.slug}
                href={`/docs/components/${e.slug}`}
                className="group rounded-[18px] p-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
              >
                <span
                  className="flex h-full flex-col gap-1 rounded-[14px] bg-white px-4 py-3.5 transition-shadow duration-300"
                  style={{ boxShadow: "var(--panel-face-shadow)" }}
                >
                  <span className="flex items-center justify-between text-[14px] font-medium text-neutral-900 tracking-[-0.01em]">
                    {e.name}
                    <span className="text-neutral-300 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-neutral-900">
                      →
                    </span>
                  </span>
                  <span className="text-[12.5px] leading-[1.5] text-neutral-500 line-clamp-2">{e.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
