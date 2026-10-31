"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const slots = buildSlots(currentPage, totalPages);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measurePill = () => {
    const btn = btnRefs.current[String(currentPage)];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cr = container.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ left: br.left - cr.left, width: br.width, ready: true });
  };

  useLayoutEffect(() => {
    measurePill();
  }, []);

  /* Only the thumb moves: it glides to the new page without overshoot,
     and the numbers themselves stay still.                            */
  useEffect(() => {
    measurePill();
  }, [currentPage]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measurePill());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [currentPage]);

  return (
    <nav
      aria-label="Pagination"
      className={[
        "inline-flex items-center gap-0.5 rounded-[13px] p-1",
        className,
      ].join(" ")}
      style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="group/nav relative overflow-hidden h-8 px-3 rounded-[9px] flex items-center gap-1.5 text-[13px] font-medium text-ink-body hover:text-ink transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[9px] opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 [background:var(--face)] [box-shadow:var(--thumb-shadow)]" />
        <svg className="relative z-10" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="relative z-10 hidden sm:inline">prev</span>
      </button>

      <div ref={containerRef} className="relative flex items-center">
        {pill.ready && (
          <span
            aria-hidden
            className="absolute top-0 bottom-0 rounded-[9px] pointer-events-none z-0"
            style={{
              left: pill.left,
              width: pill.width,
              background: "var(--face)",
              boxShadow: "var(--thumb-shadow)",
              transition: "left 340ms var(--ease-out-soft), width 340ms var(--ease-out-soft)",
            }}
          />
        )}

        {slots.map((slot, i) =>
          slot === "..." ? (
            <span
              key={`dot-${i}`}
              aria-hidden
              className="w-8 h-8 flex items-center justify-center text-[11px] text-ink-faint select-none relative z-10"
            >
              ···
            </span>
          ) : (
            <button
              key={`slot-${i}`}
              ref={(el) => {
                btnRefs.current[String(slot)] = el;
              }}
              onClick={() => slot !== currentPage && onPageChange(slot as number)}
              aria-label={`Page ${slot}`}
              aria-current={slot === currentPage ? "page" : undefined}
              className={[
                "relative z-10 min-w-8 h-8 px-1 rounded-[9px] flex items-center justify-center text-[13px] font-medium transition-colors duration-200 cursor-pointer tabular-nums",
                slot === currentPage
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {slot}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="group/nav relative overflow-hidden h-8 px-3 rounded-[9px] flex items-center gap-1.5 text-[13px] font-medium text-ink-body hover:text-ink transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[9px] opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 [background:var(--face)] [box-shadow:var(--thumb-shadow)]" />
        <span className="relative z-10 hidden sm:inline">next</span>
        <svg className="relative z-10" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

function buildSlots(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const slots: (number | "...")[] = new Array(7);

  slots[0] = 1;
  slots[6] = total;

  if (current <= 3) {
    slots[1] = 2;
    slots[2] = 3;
    slots[3] = 4;
    slots[4] = 5;
    slots[5] = "...";
  } else if (current >= total - 2) {
    slots[1] = "...";
    slots[2] = total - 4;
    slots[3] = total - 3;
    slots[4] = total - 2;
    slots[5] = total - 1;
  } else {
    slots[1] = "...";
    slots[2] = current - 1;
    slots[3] = current;
    slots[4] = current + 1;
    slots[5] = "...";
  }

  return slots;
}
