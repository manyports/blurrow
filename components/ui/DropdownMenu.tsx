"use client";

import React, { useState, useRef, useEffect, useId, useCallback, ReactNode } from "react";
import { Kbd } from "./Kbd";

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

const positionStyles: Record<DropdownMenuPosition, string> = {
  "bottom-start": "top-full left-0 mt-2 origin-top-left",
  "bottom-end": "top-full right-0 mt-2 origin-top-right",
  "top-start": "bottom-full left-0 mb-2 origin-bottom-left",
  "top-end": "bottom-full right-0 mb-2 origin-bottom-right",
};

const enterFrom: Record<DropdownMenuPosition, string> = {
  "bottom-start": "-translate-y-1.5",
  "bottom-end": "-translate-y-1.5",
  "top-start": "translate-y-1.5",
  "top-end": "translate-y-1.5",
};

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
  // Where the menu actually opens: the requested side unless that runs off-screen
  const [placement, setPlacement] = useState(position);
  const [shift, setShift] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);

  const focusItem = (index: number) => {
    const list = enabledItems();
    if (list.length === 0) return;
    list[(index + list.length) % list.length].focus();
  };

  /* Measured as soon as the menu is attached, before it fades in.
     offsetWidth/Height ignore the enter transform, so the numbers are the
     menu's settled size.                                                */
  const attachMenu = useCallback((menu: HTMLDivElement | null) => {
    menuRef.current = menu;
    const anchor = ref.current;
    if (!menu || !anchor) return;
    const gap = 8;
    const a = anchor.getBoundingClientRect();
    const w = menu.offsetWidth;
    const h = menu.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    let [v, side] = position.split("-") as ["top" | "bottom", "start" | "end"];
    const fitsStart = a.left + w <= vw - gap;
    const fitsEnd = a.right - w >= gap;
    if (side === "end" && !fitsEnd && fitsStart) side = "start";
    else if (side === "start" && !fitsStart && fitsEnd) side = "end";

    const fitsBelow = a.bottom + gap + h <= vh - gap;
    const fitsAbove = a.top - gap - h >= gap;
    if (v === "bottom" && !fitsBelow && fitsAbove) v = "top";
    else if (v === "top" && !fitsAbove && fitsBelow) v = "bottom";

    // Neither side fits (narrow screens): slide it back inside the viewport
    const left = side === "start" ? a.left : a.right - w;
    const nudge = Math.max(gap - left, 0) - Math.max(left + w - (vw - gap), 0);

    setPlacement(`${v}-${side}` as DropdownMenuPosition);
    setShift(nudge);
  }, [position]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setVisible(true);
          // Land on the first item so arrow keys work straight away
          focusItem(0);
        })
      );
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
          if (!open) {
            // Start each opening from the requested side; attachMenu flips if needed
            setPlacement(position);
            setShift(0);
          }
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
        <div
          ref={attachMenu}
          id={`${uid}-menu`}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className={[
            "absolute z-50 min-w-[200px] rounded-[16px] p-1.5",
            "transition-[opacity,transform,scale,translate] duration-200 ease-[var(--ease-spring)]",
            visible
              ? "opacity-100 scale-100 translate-y-0"
              : ["opacity-0 scale-[0.96]", enterFrom[placement]].join(" "),
            positionStyles[placement],
          ].join(" ")}
          style={{ background: "var(--panel-bezel)", boxShadow: "var(--overlay-shadow)", marginLeft: shift || undefined }}
        >
          <div
            className="bg-white rounded-[11px] p-1 flex flex-col"
            style={{ boxShadow: "var(--panel-face-shadow)" }}
          >
            {items.map((item) => {
              if (item.divider) {
                return <div key={item.key} role="separator" className="h-px bg-neutral-100 my-1 mx-2" />;
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
                      ? "text-red-600 focus:bg-red-50"
                      : "text-neutral-700 focus:text-neutral-900 focus:bg-neutral-100/80",
                  ].join(" ")}
                >
                  {item.icon && (
                    <span
                      className={[
                        "shrink-0 w-4 h-4 flex items-center justify-center transition-colors duration-100",
                        item.danger ? "text-red-500" : "text-neutral-400 group-focus/item:text-neutral-700",
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
      )}
    </div>
  );
}
