"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ENTER_FROM, LAYER, ORIGIN, Portal, Side, useAnchoredPosition } from "./Floating";

interface HoverCardProps {
  /** What you hover: a link, a name, an avatar */
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: Side;
  align?: "start" | "center" | "end";
  /** Milliseconds to wait before opening, and before closing */
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

/* A preview that floats up when you rest the pointer on something, like
   a profile behind a username. It waits a beat before opening, stays
   open while the pointer crosses into it, and opens on keyboard focus
   too. It's a preview: anything in it should also be reachable by
   following the trigger.                                          */
export function HoverCard({
  trigger,
  children,
  side = "bottom",
  align = "center",
  openDelay = 450,
  closeDelay = 200,
  className = "",
}: HoverCardProps) {
  const uid = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setFloating, side: placed } = useAnchoredPosition(ref, { open: mounted, side, align, gap: 10 });

  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    }
    const t = setTimeout(() => setMounted(false), 180);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const later = (next: boolean, ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), ms);
  };
  // Touch has no hover; a tap goes through to the trigger instead
  const enter = (e: React.PointerEvent) => e.pointerType !== "touch" && later(true, openDelay);
  const leave = (e: React.PointerEvent) => e.pointerType !== "touch" && later(false, closeDelay);

  return (
    <span
      ref={ref}
      className={["inline-flex", className].join(" ")}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={() => later(true, 0)}
      onBlur={() => later(false, closeDelay)}
    >
      {React.isValidElement(trigger)
        ? React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
            "aria-describedby": mounted ? `${uid}-card` : undefined,
          })
        : trigger}
      {mounted && (
        <Portal>
          <div
            ref={setFloating}
            id={`${uid}-card`}
            onPointerEnter={enter}
            onPointerLeave={leave}
            className="w-[300px] max-w-[calc(100vw-16px)] rounded-[18px] p-1.5 transition-[opacity,transform] duration-200 ease-[var(--ease-spring)]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: LAYER.floating,
              transformOrigin: ORIGIN[placed],
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : `${ENTER_FROM[placed]} scale(0.96)`,
              background: "var(--panel-bezel)",
              boxShadow: "var(--overlay-shadow)",
            }}
          >
            <div className="rounded-[13px] bg-panel-face p-4 text-[13px] text-ink-body" style={{ boxShadow: "var(--panel-face-shadow)" }}>
              {children}
            </div>
          </div>
        </Portal>
      )}
    </span>
  );
}
