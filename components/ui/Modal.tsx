"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { CloseButton } from "./CloseButton";
import { useModalBehavior } from "./useModalBehavior";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const CLOSE_MS = 240;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  className = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (mounted) {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!mounted || !open || visible) return;
    void dialogRef.current?.getBoundingClientRect();
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted, open, visible]);

  // Escape, focus trap + restore, scroll lock
  useModalBehavior({ open, ready: visible, ref: dialogRef, onClose });

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
      <div
        aria-hidden
        className={[
          "absolute inset-0 backdrop-blur-[6px]",
          "transition-opacity ease-out",
          visible ? "opacity-100 duration-300" : "opacity-0 duration-200",
        ].join(" ")}
        style={{ background: "var(--scrim)" }}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${uid}-title` : undefined}
        aria-describedby={description ? `${uid}-desc` : undefined}
        className={[
          "relative z-10 w-full max-w-lg rounded-[22px] p-1.5",
          "transition-[opacity,transform,scale,translate] ease-[var(--ease-spring)]",
          visible
            ? "opacity-100 scale-100 translate-y-0 duration-300"
            : "opacity-0 scale-[0.94] translate-y-3 duration-200",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ background: "var(--panel-bezel)", boxShadow: "var(--modal-shadow)" }}
      >
        <div
          className="bg-white rounded-[16px] overflow-hidden"
          style={{ boxShadow: "var(--panel-face-shadow)" }}
        >
          <div className="pl-6 pr-4 pt-5 pb-4 flex items-start gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-1">
              {title && (
                <h2
                  id={`${uid}-title`}
                  className="text-[16px] font-semibold text-neutral-900 tracking-[-0.015em] leading-snug"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={`${uid}-desc`} className="text-[13px] text-neutral-500 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <CloseButton label="Close dialog" onClick={onClose} />
          </div>

          {children && <div className="px-6 pb-5 text-[13.5px] text-neutral-600 leading-relaxed">{children}</div>}

          {/* Footer sits in the bezel tone so actions read as a separate tray */}
          {actions && (
            <div
              className="px-5 py-3.5 flex items-center justify-end gap-2"
              style={{
                background: "linear-gradient(180deg, #fafafa 0%, #f6f6f6 100%)",
                boxShadow: "inset 0 1px 0 rgba(17,17,17,0.06)",
              }}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
