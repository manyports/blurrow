"use client";

import { CSSProperties, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Align, ENTER_FROM, LAYER, ORIGIN, Side, useAnchoredPosition } from "./Floating";

interface FloatingPanelOptions {
  side?: Side;
  align?: Align;
  gap?: number;
  matchWidth?: boolean;
  /** Called after Escape closes the panel, to hand focus back */
  onEscape?: () => void;
}

/* The open/close choreography every field-anchored panel shares (select,
   date picker, colour picker, combobox): the panel is portalled to the
   body and pinned next to its anchor, stays mounted while it folds away,
   unfolds only once painted, and a click outside or Escape puts it back.
   Render the panel inside <Portal> with ref={setFloating} and
   style={panelStyle}.                                                 */
export function useFloatingPanel(anchor: RefObject<HTMLElement | null>, options: FloatingPanelOptions = {}) {
  const { side = "bottom", align = "start", gap = 8, matchWidth = false, onEscape } = options;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const escape = useRef(onEscape);
  useEffect(() => {
    escape.current = onEscape;
  });

  const position = useAnchoredPosition(anchor, { open: mounted, side, align, gap, matchWidth });
  const { floatingRef } = position;

  const close = useCallback(() => {
    setOpen(false);
    setEntered(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMounted(false), 200);
  }, []);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (anchor.current?.contains(t) || floatingRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        escape.current?.();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, anchor, floatingRef, close]);

  /* Unfolds out of the field: a clip reveals it from the anchor's side
     while it fades and settles. The clip reaches past the panel so its
     shadow is never cut off.                                          */
  const s = position.side;
  const hidden: Record<Side, string> = {
    bottom: "inset(-48px -48px 55% -48px)",
    top: "inset(55% -48px -48px -48px)",
    left: "inset(-48px -48px -48px 55%)",
    right: "inset(-48px 55% -48px -48px)",
  };
  const panelStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: LAYER.floating,
    background: "var(--panel-bezel)",
    boxShadow: "var(--overlay-shadow)",
    transformOrigin: ORIGIN[s],
    opacity: entered ? 1 : 0,
    transform: entered ? "none" : `${ENTER_FROM[s]} scale(0.98)`,
    clipPath: entered ? "inset(-48px -48px -48px -48px)" : hidden[s],
    transition: entered
      ? "opacity 180ms ease-out, transform 360ms var(--ease-out-soft), clip-path 360ms var(--ease-out-soft)"
      : "opacity 160ms ease-in, transform 200ms ease-in, clip-path 200ms ease-in",
  };

  return {
    open,
    mounted,
    entered,
    show,
    close,
    toggle: open ? close : show,
    side: s,
    setFloating: position.setFloating,
    panelStyle,
  };
}
