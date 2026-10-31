import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center gap-1 min-w-0">
              {i > 0 && (
                <svg
                  aria-hidden
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-ink-ghost shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={[
                    "text-[12.5px] px-1.5 py-0.5 truncate",
                    isLast ? "font-medium text-ink" : "text-ink-muted",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-[12.5px] text-ink-muted hover:text-ink px-1.5 py-0.5 rounded-[6px] hover:bg-ink/[0.05] transition-colors truncate"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
