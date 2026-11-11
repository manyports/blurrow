"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export interface CasePart {
  slug: string;
  name: string;
  /** grid spans on a wide screen (12ths) */
  span: string;
  children: React.ReactNode;
}

const PHONE = "(max-width: 639px)";
/* How far a covered card steps back: a little smaller, lifted so its top
   edge shows above the one over it, and dimmed                      */
const SHRINK = 0.06;
const LIFT = 14;
const DIM = 0.5;
const PIN_GAP = 28;

/* The parts case. On a wide screen, a raised case of sunken compartments,
   each sized to the part in it. On a phone, a deck: every part is the
   same raised card, pinned at the same height, and the next one slides
   up over it as you scroll; the one underneath steps back as it's
   covered, so they pile up neatly instead of overlapping.          */
export function PartsCase({ parts }: { parts: CasePart[] }) {
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    let raf = 0;
    const reset = () => cards.current.forEach((c) => c && (c.style.transform = "", c.style.setProperty("--cover", "0")));
    const update = () => {
      raf = 0;
      if (!mq.matches) return reset();
      const list = cards.current;
      // where the cards pin: under the header, as in the sticky class below
      const pin = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-h")) || 0) + PIN_GAP;
      for (let i = 0; i < list.length; i++) {
        const card = list[i];
        const next = list[i + 1];
        if (!card) continue;
        let cover = 0;
        if (next) {
          // how much of this card the next one has slid over, 0 to 1,
          // measured from the pin line (not this card's own box, which
          // is the thing being moved)
          const h = card.offsetHeight;
          cover = Math.min(1, Math.max(0, (pin + h - next.getBoundingClientRect().top) / h));
        }
        card.style.transform = cover ? `translateY(${-cover * LIFT}px) scale(${1 - cover * SHRINK})` : "";
        card.style.setProperty("--cover", String(cover));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <div
      className="mt-12 rounded-[34px] p-2.5 sm:mt-16 sm:p-3 max-sm:-mx-1 max-sm:bg-none! max-sm:p-0 max-sm:shadow-none!"
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 lg:grid-cols-12">
        {parts.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className={[
              "group/part relative flex flex-col rounded-[24px] p-5 sm:p-6",
              // wide: a sunken compartment, sized to its part
              "sm:[background:var(--well)] sm:[box-shadow:var(--well-shadow)]",
              // phone: a raised card of fixed height, pinned under the header
              "max-sm:sticky max-sm:top-[calc(var(--site-header-h,0px)+28px)] max-sm:h-[440px] max-sm:origin-top max-sm:[background:var(--card)] max-sm:[box-shadow:var(--card-shadow)]",
              p.span,
            ].join(" ")}
          >
            <div className="flex min-h-[170px] flex-1 items-center justify-center py-8">{p.children}</div>
            {/* stamped into the floor of the compartment */}
            <Link
              href={`/docs/components/${p.slug}`}
              className="relative z-10 flex items-center justify-between gap-3 rounded-[8px] text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              style={{ textShadow: "var(--emboss)" }}
            >
              {p.name}
              <span aria-hidden className="opacity-0 transition-[opacity,transform] duration-300 group-hover/part:translate-x-0.5 group-hover/part:opacity-100">
                →
              </span>
            </Link>
            {/* the shade that falls on a card as the next one covers it */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit] sm:hidden"
              style={{ background: "var(--page)", opacity: `calc(var(--cover, 0) * ${DIM})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
