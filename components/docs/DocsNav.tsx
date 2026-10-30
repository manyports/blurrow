"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "./nav";

/* The page's own navigation, set straight on the page: quiet labels,
   and the current link raised as a thumb — the Tabs vocabulary.      */
export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      {docsNav.map((section) => (
        <div key={section.title} className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[12px] font-medium text-neutral-400">
            {section.title}
          </p>
          {section.links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={[
                  "px-3 py-[7px] rounded-[10px] text-[13.5px] tracking-[-0.005em] transition-[color,background-color] duration-200",
                  "outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-900",
                  active
                    ? "font-medium text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-900/[0.035]",
                ].join(" ")}
                style={active ? { background: "var(--face-light)", boxShadow: "var(--thumb-shadow)" } : undefined}
              >
                {link.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
