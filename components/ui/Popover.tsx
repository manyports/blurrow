"use client";

import React, { useState, useRef, useEffect, useId } from "react";

type PopoverPosition = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: PopoverPosition;
  className?: string;
}

/* Anchored with margins on a wrapper so the panel's own transform is free
   for the enter motion, which scales out from the trigger side. */
const positionStyles: Record<PopoverPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 pb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 pt-2",
  left: "right-full top-1/2 -translate-y-1/2 pr-2",
  right: "left-full top-1/2 -translate-y-1/2 pl-2",
};

const origin: Record<PopoverPosition, string> = {
  top: "origin-bottom",
  bottom: "origin-top",
  left: "origin-right",
  right: "origin-left",
};

const enterFrom: Record<PopoverPosition, string> = {
  top: "translate-y-1.5",
  bottom: "-translate-y-1.5",
  left: "translate-x-1.5",
  right: "-translate-x-1.5",
};

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
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

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
        <div className={["absolute z-50", positionStyles[position]].join(" ")}>
          <div
            ref={panelRef}
            id={`${uid}-popover`}
            role="dialog"
            className={[
              "min-w-[220px] rounded-[16px] p-1.5",
              "transition-[opacity,transform,scale,translate] duration-200 ease-[var(--ease-spring)]",
              origin[position],
              visible
                ? "opacity-100 scale-100 translate-x-0 translate-y-0"
                : ["opacity-0 scale-[0.96]", enterFrom[position]].join(" "),
            ].join(" ")}
            style={{ background: "var(--panel-bezel)", boxShadow: "var(--overlay-shadow)" }}
          >
            <div
              className="bg-panel-face rounded-[11px] p-3.5 text-[13px] text-ink-body leading-relaxed"
              style={{ boxShadow: "var(--panel-face-shadow)" }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
