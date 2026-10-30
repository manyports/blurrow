"use client";

import { useEffect, useState } from "react";
import { TableOfContents, type TocItem } from "@/components/ui/TableOfContents";

/* The library's own TableOfContents, driven by the headings in view. */
export function OnThisPage({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.key ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.key)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const scrollTo = (key: string) => {
    setActive(key);
    document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${key}`);
  };

  return <TableOfContents items={items} activeKey={active} onSelect={scrollTo} />;
}
