"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { CloseButton } from "./CloseButton";
import { useModalBehavior } from "./useModalBehavior";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ENTER_MS = 380;
const EXIT_MS = 240;

const sizeMap = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  side = "right",
  size = "md",
  className = "",
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  /* ── mount / unmount ────────────────────────────────── */
  /* Mounting on open and sliding out on close happen during render, so
     neither waits for an extra commit; only the unmount is delayed */
  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (open || !mounted) return;
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open, mounted]);

  /* ── trigger enter animation after mount ────────────── */
  useLayoutEffect(() => {
    if (!mounted || !open || visible) return;
    void panelRef.current?.getBoundingClientRect();
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted, open, visible]);

  /* ── Escape, focus trap + restore, scroll lock ─────── */
  useModalBehavior({ open, ready: visible, ref: panelRef, onClose });

  if (!mounted) return null;

  const isRight = side === "right";

  return (
    <div className="fixed inset-0 z-90">
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-[6px] transition-opacity ease-out"
        style={{
          background: "var(--scrim)",
          opacity: visible ? 1 : 0,
          transitionDuration: `${visible ? ENTER_MS : EXIT_MS}ms`,
        }}
        onClick={onClose}
      />

      {/* Floats a few px off the viewport edge so it reads as a panel, not a wall */}
      <div
        className={[
          "absolute inset-y-0 w-full p-2 flex",
          isRight ? "right-0 justify-end" : "left-0 justify-start",
        ].join(" ")}
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? `${uid}-title` : undefined}
          aria-describedby={description ? `${uid}-desc` : undefined}
          className={[
            "relative h-full w-full rounded-[22px] p-1.5 flex flex-col pointer-events-auto",
            sizeMap[size],
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            background: "var(--panel-bezel)",
            boxShadow: "var(--modal-shadow)",
            transform: visible
              ? "translateX(0)"
              : isRight
                ? "translateX(calc(100% + 16px))"
                : "translateX(calc(-100% - 16px))",
            transition: `transform ${visible ? ENTER_MS : EXIT_MS}ms ${
              visible ? "var(--ease-out-soft)" : "cubic-bezier(0.4,0,1,1)"
            }`,
          }}
        >
          <div
            className="flex flex-col h-full bg-panel-face rounded-[16px] overflow-hidden"
            style={{ boxShadow: "var(--panel-face-shadow)" }}
          >
            <div className="pl-6 pr-4 pt-5 pb-4 flex items-start gap-4 shrink-0">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-1">
                {title && (
                  <h2
                    id={`${uid}-title`}
                    className="text-[16px] font-semibold text-ink tracking-[-0.015em] leading-snug"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={`${uid}-desc`} className="text-[13px] text-ink-muted leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <CloseButton label="Close drawer" onClick={onClose} />
            </div>

            {children && (
              <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-5 text-[13.5px] text-ink-body leading-relaxed">
                {children}
              </div>
            )}

            {actions && (
              <div
                className="mt-auto px-5 py-3.5 flex items-center justify-end gap-2 shrink-0"
                style={{
                  background: "var(--panel-tray)",
                  boxShadow: "inset 0 1px 0 var(--hairline)",
                }}
              >
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
