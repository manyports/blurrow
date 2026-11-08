"use client";

import React, { RefObject, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/* ── Portal ───────────────────────────────────────────────────────── */
/* Anything that floats over the page is rendered at the end of <body>.
   Left where it was declared, a panel lives inside whatever stacking
   context its parents made (a transform, a filter, an isolate), and a
   later sibling on the page can paint straight over it, whatever its
   z-index says.                                                     */
const noop = () => () => {};

export function Portal({ children }: { children: React.ReactNode }) {
  const client = useSyncExternalStore(noop, () => true, () => false);
  return client ? createPortal(children, document.body) : null;
}

/* Layers, lowest first: dialogs, then toasts, then anything anchored to
   a control (so a select inside a modal opens over the modal), then
   tooltips over all of it.                                          */
export const LAYER = { dialog: 90, toast: 95, floating: 100, tooltip: 110 } as const;

/* ── Anchored position ────────────────────────────────────────────── */
export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };
const PAD = 8;

interface AnchorOptions {
  open: boolean;
  side?: Side;
  align?: Align;
  /** Space between the anchor and the panel */
  gap?: number;
  /** Make the panel at least as wide as the anchor (selects, comboboxes) */
  matchWidth?: boolean;
}

/* Places a fixed-position panel next to its anchor: on the side asked
   for unless the other side has more room, then nudged back inside the
   viewport. Follows the anchor while the page scrolls or resizes. The
   position is written straight onto the element, so scrolling never
   re-renders the component.                                         */
export function useAnchoredPosition(
  anchor: RefObject<HTMLElement | null>,
  { open, side = "bottom", align = "start", gap = 8, matchWidth = false }: AnchorOptions,
) {
  const [placed, setPlaced] = useState<Side>(side);
  const floating = useRef<HTMLElement | null>(null);

  const update = useCallback(() => {
    const a = anchor.current?.getBoundingClientRect();
    const el = floating.current;
    if (!a || !el) return;
    if (matchWidth) el.style.minWidth = `${a.width}px`;

    // offset sizes ignore the enter transform, so these are the settled size
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const room: Record<Side, number> = { top: a.top, bottom: vh - a.bottom, left: a.left, right: vw - a.right };
    const vertical = side === "top" || side === "bottom";
    const need = (vertical ? h : w) + gap + PAD;

    let s = side;
    if (room[s] < need && room[OPPOSITE[s]] > room[s]) s = OPPOSITE[s];

    let top: number;
    let left: number;
    if (s === "top" || s === "bottom") {
      top = s === "bottom" ? a.bottom + gap : a.top - gap - h;
      left = align === "start" ? a.left : align === "end" ? a.right - w : a.left + (a.width - w) / 2;
    } else {
      left = s === "right" ? a.right + gap : a.left - gap - w;
      top = align === "start" ? a.top : align === "end" ? a.bottom - h : a.top + (a.height - h) / 2;
    }
    left = Math.max(PAD, Math.min(left, vw - w - PAD));
    top = Math.max(PAD, Math.min(top, vh - h - PAD));

    el.style.top = `${Math.round(top)}px`;
    el.style.left = `${Math.round(left)}px`;
    el.dataset.side = s;
    setPlaced(s);
  }, [anchor, side, align, gap, matchWidth]);

  /* Attach this as the panel's ref: it's placed before its first paint */
  const setFloating = useCallback(
    (el: HTMLElement | null) => {
      floating.current = el;
      if (el) update();
    },
    [update],
  );

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    // The panel can change size while open (a filtered list, a new month)
    const ro = new ResizeObserver(schedule);
    if (floating.current) ro.observe(floating.current);
    if (anchor.current) ro.observe(anchor.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [open, update, anchor]);

  return { setFloating, side: placed, floatingRef: floating, update };
}

/* Where the panel grows from, and where it slides in from, for each side */
export const ORIGIN: Record<Side, string> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};
export const ENTER_FROM: Record<Side, string> = {
  top: "translateY(4px)",
  bottom: "translateY(-4px)",
  left: "translateX(4px)",
  right: "translateX(-4px)",
};
