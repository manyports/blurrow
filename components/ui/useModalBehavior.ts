"use client";

import { RefObject, useEffect } from "react";

interface ModalBehaviorOptions {
  /** The dialog is logically open */
  open: boolean;
  /** The dialog is mounted and painted — focus can move into it */
  ready: boolean;
  ref: RefObject<HTMLElement | null>;
  onClose: () => void;
  /** Element to focus on open; defaults to the first focusable */
  initialFocus?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Everything a modal surface owes the person using it: Escape closes,
   focus is trapped inside, the page behind doesn't scroll, and focus
   returns to whatever opened it.                                     */
export function useModalBehavior({ open, ready, ref, onClose, initialFocus }: ModalBehaviorOptions) {
  // Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus trap + restore
  useEffect(() => {
    if (!open || !ready) return;
    const el = ref.current;
    if (!el) return;

    const opener = document.activeElement as HTMLElement | null;
    const target = initialFocus?.current ?? el.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", trap);
    return () => {
      el.removeEventListener("keydown", trap);
      opener?.focus?.();
    };
  }, [open, ready, ref, initialFocus]);
}
