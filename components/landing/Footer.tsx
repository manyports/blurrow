"use client";

import Link from "next/link";
import { author, npmUrl, repo } from "@/lib/site";

const columns = [
  {
    title: "docs",
    links: [
      { label: "introduction", href: "/docs" },
      { label: "installation", href: "/docs/installation" },
      { label: "all components", href: "/docs/components" },
    ],
  },
  {
    title: "popular",
    links: [
      { label: "button", href: "/docs/components/button" },
      { label: "input", href: "/docs/components/input" },
      { label: "tabs", href: "/docs/components/tabs" },
      { label: "toast", href: "/docs/components/toast" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="pt-14 pb-16 border-t border-ink/[0.08] grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-12">
          <div className="flex flex-col gap-5">
            <p className="text-[22px] font-medium tracking-[-0.035em] text-ink">
              blurrow<span className="text-ink-faint">/ui</span>
            </p>
            <p className="text-[15px] leading-[1.6] text-ink-muted max-w-[40ch]">
              made with care by{" "}
              <a href={author.site} target="_blank" rel="noopener" className="link-slide text-ink">
                {author.handle}
              </a>
              . it&apos;s open source, so if something feels off, or wonderful,{" "}
              <a href={`${repo.url}/issues/new`} target="_blank" rel="noopener" className="link-slide text-ink">
                open an issue
              </a>{" "}
              and tell me about it.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {columns.map((c) => (
              <nav key={c.title} aria-label={c.title} className="flex flex-col gap-3">
                <p className="text-[13px] text-ink-faint">{c.title}</p>
                {c.links.map((l) => (
                  <Link key={l.href} href={l.href} className="link-slide self-start text-[14px] text-ink-label hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                ))}
              </nav>
            ))}
            <nav aria-label="elsewhere" className="flex flex-col gap-3">
              <p className="text-[13px] text-ink-faint">elsewhere</p>
              {[
                { href: repo.url, label: "github" },
                { href: npmUrl, label: "npm" },
                { href: author.site, label: author.siteLabel },
              ].map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className="link-slide self-start text-[14px] text-ink-label hover:text-ink transition-colors">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

      </div>
    </footer>
  );
}
