"use client";

import React, { useState, useRef, useCallback, useEffect, useId } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

const origin: Record<TooltipPosition, string> = {
  top: "origin-bottom",
  bottom: "origin-top",
  left: "origin-right",
  right: "origin-left",
};

const enterTranslate: Record<TooltipPosition, string> = {
  top: "translate-y-1",
  bottom: "-translate-y-1",
  left: "translate-x-1",
  right: "-translate-x-1",
};

export function Tooltip({
  content,
  position = "top",
  children,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
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

  const measure = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const tr = triggerRef.current.getBoundingClientRect();
    const tp = tooltipRef.current.getBoundingClientRect();
    const gap = 7;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = -(tp.height + gap);
        left = (tr.width - tp.width) / 2;
        break;
      case "bottom":
        top = tr.height + gap;
        left = (tr.width - tp.width) / 2;
        break;
      case "left":
        top = (tr.height - tp.height) / 2;
        left = -(tp.width + gap);
        break;
      case "right":
        top = (tr.height - tp.height) / 2;
        left = tr.width + gap;
        break;
    }

    const viewportPadding = 8;
    const absLeft = triggerRef.current.getBoundingClientRect().left + left;
    const overflowRight = absLeft + tp.width - (window.innerWidth - viewportPadding);
    const overflowLeft = viewportPadding - absLeft;
    if (overflowRight > 0) left -= overflowRight;
    if (overflowLeft > 0) left += overflowLeft;

    setCoords({ top, left });
  }, [position]);

  /* Measured as soon as the tooltip is attached, like DropdownMenu, so
     it's placed before the first paint rather than after it           */
  const attachTooltip = useCallback((el: HTMLDivElement | null) => {
    tooltipRef.current = el;
    if (el) measure();
  }, [measure]);

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
        <div
          ref={attachTooltip}
          id={`${uid}-tip`}
          role="tooltip"
          className={[
            "absolute z-50 px-2.5 py-1.5 rounded-[9px] text-ink-inverse text-[11.5px] font-medium whitespace-nowrap pointer-events-none",
            "transition-[opacity,transform,scale,translate] duration-150 ease-[var(--ease-spring)]",
            origin[position],
            visible
              ? "opacity-100 scale-100 translate-x-0 translate-y-0"
              : ["opacity-0 scale-95", enterTranslate[position]].join(" "),
          ].join(" ")}
          style={{
            top: coords.top,
            left: coords.left,
            background: "var(--face-inverse)",
            boxShadow: "var(--tooltip-shadow)",
            textShadow: "var(--emboss-inverse)",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
