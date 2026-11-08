"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { ENTER_FROM, LAYER, ORIGIN, Portal, useAnchoredPosition } from "./Floating";

type PopoverPosition = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: PopoverPosition;
  className?: string;
}

export function Popover({
  trigger,
  children,
  position = "bottom",
  className = "",
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  // Portalled and pinned beside the trigger, flipping if there's no room
  const { setFloating, floatingRef, side } = useAnchoredPosition(ref, { open: mounted, side: position, align: "center" });

  /* Mounted and faded out during render; the effect only times the rest */
  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setVisible(true);
          // The panel lives at the end of <body>; bring focus to it so Tab reaches its contents
          const panel = floatingRef.current;
          const first = panel?.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          (first ?? panel)?.focus({ preventScroll: true });
        }),
      );
    } else {
      const t = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(t);
    }
  }, [open, floatingRef]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (ref.current?.contains(t) || floatingRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [floatingRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector<HTMLElement>("[data-popover-trigger] button, [data-popover-trigger] a")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={ref} className={["relative inline-flex", className].join(" ")}>
      <div data-popover-trigger onClick={() => setOpen((v) => !v)} className="inline-flex cursor-pointer">
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
              "aria-haspopup": "dialog",
              "aria-expanded": open,
              "aria-controls": open ? `${uid}-popover` : undefined,
            })
          : trigger}
      </div>
      {mounted && (
        <Portal>
          <div
            ref={setFloating}
            id={`${uid}-popover`}
            role="dialog"
            tabIndex={-1}
            className="outline-none min-w-[220px] max-w-[calc(100vw-16px)] rounded-[16px] p-1.5 transition-[opacity,transform] duration-200 ease-[var(--ease-spring)]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: LAYER.floating,
              transformOrigin: ORIGIN[side],
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : `${ENTER_FROM[side]} scale(0.96)`,
              background: "var(--panel-bezel)",
              boxShadow: "var(--overlay-shadow)",
            }}
          >
            <div
              className="bg-panel-face rounded-[11px] p-3.5 text-[13px] text-ink-body leading-relaxed"
              style={{ boxShadow: "var(--panel-face-shadow)" }}
            >
              {children}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
