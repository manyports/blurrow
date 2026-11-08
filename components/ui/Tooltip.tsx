"use client";

import React, { useState, useRef, useCallback, useEffect, useId } from "react";
import { ENTER_FROM, LAYER, ORIGIN, Portal, useAnchoredPosition } from "./Floating";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  position = "top",
  children,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchActiveRef = useRef(false);
  const uid = useId();

  const hide = useCallback(() => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    setVisible(false);
    exitTimer.current = setTimeout(() => {
      setMounted(false);
      setOpen(false);
    }, 150);
  }, []);

  const show = useCallback((fromTouch = false) => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    enterTimer.current = setTimeout(() => setOpen(true), fromTouch ? 0 : 80);
    if (fromTouch) {
      autoHideTimer.current = setTimeout(() => {
        touchActiveRef.current = false;
        hide();
      }, 2400);
    }
  }, [hide]);

  // Mounted during render; the effect only waits for it to paint
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }
  }, [open]);

  /* Portalled to the body and placed before its first paint, flipping
     to the other side when there's no room                           */
  const { setFloating, side } = useAnchoredPosition(triggerRef, { open: mounted, side: position, align: "center", gap: 7 });

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) {
        touchActiveRef.current = false;
        hide();
      }
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [open, hide]);

  // Escape dismisses without moving focus (WCAG 1.4.13)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hide]);

  useEffect(() => {
    return () => {
      if (enterTimer.current) clearTimeout(enterTimer.current);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, []);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    show(false);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (touchActiveRef.current) return;
    hide();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    touchActiveRef.current = true;
    if (open) {
      hide();
    } else {
      show(true);
    }
  };

  return (
    <div
      ref={triggerRef}
      className={["relative inline-flex", className].join(" ")}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onFocus={() => show(false)}
      onBlur={() => {
        if (!touchActiveRef.current) hide();
      }}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            "aria-describedby": mounted ? `${uid}-tip` : undefined,
          })
        : children}
      {mounted && (
        <Portal>
        <div
          ref={setFloating}
          id={`${uid}-tip`}
          role="tooltip"
          className="px-2.5 py-1.5 rounded-[9px] text-ink-inverse text-[11.5px] font-medium whitespace-nowrap pointer-events-none transition-[opacity,transform] duration-150 ease-[var(--ease-spring)]"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: LAYER.tooltip,
            transformOrigin: ORIGIN[side],
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : `${ENTER_FROM[side]} scale(0.95)`,
            background: "var(--face-inverse)",
            boxShadow: "var(--tooltip-shadow)",
            textShadow: "var(--emboss-inverse)",
          }}
        >
          {content}
        </div>
        </Portal>
      )}
    </div>
  );
}
