"use client";

import React, { useState, useRef, useEffect, useId, useCallback, ReactNode } from "react";
import { Kbd } from "./Kbd";
import { ENTER_FROM, LAYER, Portal, useAnchoredPosition } from "./Floating";

type DropdownMenuPosition =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

export interface DropdownMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  position?: DropdownMenuPosition;
  onSelect?: (key: string) => void;
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  position = "bottom-end",
  onSelect,
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const uid = useId();
  const [v, h] = position.split("-") as ["top" | "bottom", "start" | "end"];
  // Portalled and pinned to the trigger; flips up or over when it runs out of room
  const { setFloating, side } = useAnchoredPosition(ref, { open: mounted, side: v, align: h });
  const attachMenu = useCallback(
    (el: HTMLDivElement | null) => {
      menuRef.current = el;
      setFloating(el);
    },
    [setFloating],
  );

  const enabledItems = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);

  const focusItem = (index: number) => {
    const list = enabledItems();
    if (list.length === 0) return;
    list[(index + list.length) % list.length].focus();
  };

  /* Mounted and faded out during render; the effect only times the rest */
  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setVisible(true);
          // Land on the first item so arrow keys work straight away
          enabledItems()[0]?.focus();
        })
      );
    } else {
      const t = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (ref.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const returnFocus = () => {
    ref.current?.querySelector<HTMLElement>("[data-menu-trigger] button, [data-menu-trigger] a")?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const list = enabledItems();
    const at = list.indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(at + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(at - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(list.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        returnFocus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  function handleSelect(item: DropdownMenuItem) {
    if (item.disabled) return;
    onSelect?.(item.key);
    setOpen(false);
    returnFocus();
  }

  return (
    <div ref={ref} className={["relative inline-flex", className].join(" ")}>
      <div
        data-menu-trigger
        onClick={() => {
          setOpen(!open);
        }}
        className="inline-flex cursor-pointer"
      >
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
              "aria-haspopup": "menu",
              "aria-expanded": open,
              "aria-controls": open ? `${uid}-menu` : undefined,
            })
          : trigger}
      </div>
      {mounted && (
        <Portal>
        <div
          ref={attachMenu}
          id={`${uid}-menu`}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className="min-w-[200px] rounded-[16px] p-1.5 transition-[opacity,transform] duration-200 ease-[var(--ease-spring)]"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: LAYER.floating,
            transformOrigin: `${side === "top" ? "bottom" : "top"} ${h === "start" ? "left" : "right"}`,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : `${ENTER_FROM[side]} scale(0.96)`,
            background: "var(--panel-bezel)",
            boxShadow: "var(--overlay-shadow)",
          }}
        >
          <div
            className="bg-panel-face rounded-[11px] p-1 flex flex-col"
            style={{ boxShadow: "var(--panel-face-shadow)" }}
          >
            {items.map((item) => {
              if (item.divider) {
                return <div key={item.key} role="separator" className="h-px bg-line my-1 mx-2" />;
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={(e) => e.currentTarget.focus()}
                  disabled={item.disabled}
                  className={[
                    "group/item w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium cursor-pointer outline-none",
                    "transition-[background,color] duration-100",
                    "disabled:opacity-35 disabled:pointer-events-none",
                    item.danger
                      ? "text-danger focus:bg-danger-wash"
                      : "text-ink-label focus:text-ink focus:bg-surface-active/80",
                  ].join(" ")}
                >
                  {item.icon && (
                    <span
                      className={[
                        "shrink-0 w-4 h-4 flex items-center justify-center transition-colors duration-100",
                        item.danger ? "text-danger-soft" : "text-ink-faint group-focus/item:text-ink-label",
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && <Kbd className="shrink-0">{item.shortcut}</Kbd>}
                </button>
              );
            })}
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
