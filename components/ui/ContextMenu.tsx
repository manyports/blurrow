"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import type { DropdownMenuItem } from "./DropdownMenu";
import { LAYER, Portal } from "./Floating";
import { Kbd } from "./Kbd";

export type ContextMenuItem = DropdownMenuItem;

interface ContextMenuProps {
  /** The area that answers a right-click */
  children: React.ReactNode;
  items: ContextMenuItem[];
  onSelect?: (key: string) => void;
  disabled?: boolean;
  className?: string;
}

const PAD = 8;
const LONG_PRESS = 500;

/* The same panel as DropdownMenu, opened where you right-click instead of
   under a button. A long press opens it on touch, and the context-menu
   key or shift+F10 opens it from the keyboard at the focused element.
   It grows out of the corner nearest the pointer and flips to stay on
   screen.                                                           */
export function ContextMenu({ children, items, onSelect, disabled = false, className = "" }: ContextMenuProps) {
  const uid = useId();
  const areaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const press = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = point !== null;

  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setVisible(true);
          menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus();
        }),
      );
      return () => cancelAnimationFrame(id);
    }
    const t = setTimeout(() => setMounted(false), 160);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const shut = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      setPoint(null);
    };
    const onScroll = () => setPoint(null);
    document.addEventListener("pointerdown", shut);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    window.addEventListener("blur", onScroll);
    return () => {
      document.removeEventListener("pointerdown", shut);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("blur", onScroll);
    };
  }, [open]);

  /* Placed as soon as it's attached: beside the pointer, flipped left or
     up if it would run off the edge. Only writes to the element, so it
     can run on every render without setting state.                  */
  const attach = (el: HTMLDivElement | null) => {
    menuRef.current = el;
    if (!el || !point) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const flipX = point.x + w > vw - PAD;
    const flipY = point.y + h > vh - PAD;
    el.style.left = `${Math.max(PAD, flipX ? point.x - w : point.x)}px`;
    el.style.top = `${Math.max(PAD, flipY ? point.y - h : point.y)}px`;
    el.style.transformOrigin = `${flipY ? "bottom" : "top"} ${flipX ? "right" : "left"}`;
  };

  const openAt = (x: number, y: number) => {
    if (disabled) return;
    setPoint({ x, y });
  };

  const close = (refocus = true) => {
    setPoint(null);
    if (refocus) areaRef.current?.focus({ preventScroll: true });
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const list = enabledItems();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => list[(i + list.length) % list.length]?.focus();
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        go(at + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        go(at - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(list.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case "Tab":
        e.preventDefault();
        close();
        break;
    }
  };

  const cancelPress = () => {
    if (press.current) clearTimeout(press.current);
  };

  return (
    <>
      <div
        ref={areaRef}
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${uid}-menu` : undefined}
        aria-describedby={`${uid}-how`}
        className={["outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page", className].join(" ")}
        onContextMenu={(e) => {
          if (disabled) return;
          e.preventDefault();
          openAt(e.clientX, e.clientY);
        }}
        onKeyDown={(e) => {
          if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
            e.preventDefault();
            const r = areaRef.current!.getBoundingClientRect();
            openAt(r.left + 16, r.top + 16);
          }
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "touch") return;
          const { clientX, clientY } = e;
          cancelPress();
          press.current = setTimeout(() => openAt(clientX, clientY), LONG_PRESS);
        }}
        onPointerUp={cancelPress}
        onPointerMove={cancelPress}
        onPointerCancel={cancelPress}
      >
        {children}
        <span id={`${uid}-how`} className="sr-only">
          right-click, long-press, or press shift f10 for options
        </span>
      </div>

      {mounted && (
        <Portal>
          <div
            ref={attach}
            id={`${uid}-menu`}
            role="menu"
            onKeyDown={onMenuKeyDown}
            onContextMenu={(e) => e.preventDefault()}
            className="min-w-[200px] rounded-[16px] p-1.5 transition-[opacity,transform] duration-150 ease-[var(--ease-spring)]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: LAYER.floating,
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "scale(0.94)",
              background: "var(--panel-bezel)",
              boxShadow: "var(--overlay-shadow)",
            }}
          >
            <div className="flex flex-col rounded-[11px] bg-panel-face p-1" style={{ boxShadow: "var(--panel-face-shadow)" }}>
              {items.map((item) =>
                item.divider ? (
                  <div key={item.key} role="separator" className="mx-2 my-1 h-px bg-line" />
                ) : (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    disabled={item.disabled}
                    onClick={() => {
                      onSelect?.(item.key);
                      close();
                    }}
                    onMouseEnter={(e) => e.currentTarget.focus()}
                    className={[
                      "group/item flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] font-medium outline-none",
                      "transition-[background,color] duration-100 disabled:pointer-events-none disabled:opacity-35",
                      item.danger ? "text-danger focus:bg-danger-wash" : "text-ink-label focus:bg-surface-active/80 focus:text-ink",
                    ].join(" ")}
                  >
                    {item.icon && (
                      <span
                        className={[
                          "flex h-4 w-4 shrink-0 items-center justify-center transition-colors duration-100",
                          item.danger ? "text-danger-soft" : "text-ink-faint group-focus/item:text-ink-label",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.shortcut && <Kbd className="shrink-0">{item.shortcut}</Kbd>}
                  </button>
                ),
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
