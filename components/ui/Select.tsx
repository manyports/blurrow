"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Portal } from "./Floating";
import { useFloatingPanel } from "./useFloatingPanel";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/* The closed select is a sunken field like Input; the open list is a
   floating panel like DropdownMenu. Keyboard follows the ARIA listbox
   pattern: arrows move, Enter picks, Escape backs out.                */
export function Select({
  options,
  value,
  onChange,
  placeholder = "select…",
  label,
  hint,
  disabled = false,
  fullWidth = false,
  className = "",
}: SelectProps) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  // The list is portalled to the body and pinned under the field
  const { open, mounted, close, show, setFloating, panelStyle } = useFloatingPanel(ref, {
    matchWidth: true,
    onEscape: () => buttonRef.current?.focus(),
  });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    show();
  };

  const pick = (index: number) => {
    const opt = options[index];
    if (!opt) return;
    onChange?.(opt.value);
    close();
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        pick(active);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
      default:
        // Type-ahead: jump to the first option starting with the key
        if (e.key.length === 1) {
          const k = e.key.toLowerCase();
          const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(k));
          if (hit >= 0) setActive(hit);
        }
    }
  };

  return (
    <div className={["flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && (
        <span
          id={`${uid}-label`}
          className="text-[12.5px] font-medium text-ink-label tracking-[-0.005em]"
        >
          {label}
        </span>
      )}

      <div
        ref={ref}
        className={["relative", fullWidth ? "w-full" : "inline-block", className].join(" ")}
      >
        <button
          ref={buttonRef}
          type="button"
          /* A select-only combobox: the role is what lets the button point
             at the active option while focus stays on it                */
          role="combobox"
          disabled={disabled}
          onClick={() => (open ? close() : openList())}
          onKeyDown={onKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? `${uid}-list` : undefined}
          aria-labelledby={label ? `${uid}-label ${uid}-value` : undefined}
          aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
          className={[
            "group/select relative isolate inline-flex items-center justify-between gap-3 w-full",
            "rounded-xl px-4 py-3 text-[13.5px] font-medium text-ink",
            "field cursor-pointer select-none",
            "focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
          ].join(" ")}
          data-open={open || undefined}
        >
          <span
            id={`${uid}-value`}
            className={[
              "relative z-10 truncate",
              selected ? "text-ink" : "text-ink-faint font-normal",
            ].join(" ")}
          >
            {selected ? selected.label : placeholder}
          </span>
          <svg
            aria-hidden
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className={[
              "relative z-10 shrink-0 transition-[transform,color] duration-300 ease-[var(--ease-spring)]",
              open ? "rotate-180 text-ink" : "text-ink-faint group-hover/select:text-ink-label",
            ].join(" ")}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>

          {open && (
            <span aria-hidden className="pointer-events-none absolute inset-0 z-5 rounded-xl overflow-hidden">
              <span
                className="block absolute inset-y-0 w-[30%] -left-[30%] animate-input-shimmer"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--shimmer) 50%, transparent 100%)",
                }}
              />
            </span>
          )}
        </button>

        {mounted && (
          <Portal>
          <div
            ref={setFloating}
            className="p-1.5 rounded-[16px]"
            style={{
              ...panelStyle,
              maxWidth: "min(420px, calc(100vw - 2rem))",
              width: "max-content",
            }}
          >
            <div
              ref={listRef}
              id={`${uid}-list`}
              role="listbox"
              aria-labelledby={label ? `${uid}-label` : undefined}
              className="bg-panel-face rounded-[11px] p-1 flex flex-col gap-0.5 max-h-72 overflow-y-auto scroll-thin"
              style={{ boxShadow: "var(--panel-face-shadow)" }}
            >
              {options.map((opt, i) => {
                const isSelected = opt.value === value;
                const isActive = i === active;
                return (
                  <div
                    key={opt.value}
                    id={`${uid}-opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(i)}
                    onMouseMove={() => setActive(i)}
                    className={[
                      "flex items-center justify-between gap-3 w-full px-2.5 py-2 text-[13px] rounded-[8px] cursor-pointer",
                      "transition-colors duration-100",
                      isSelected ? "font-medium" : "",
                      // one ink per state: utilities sort by name, so text-ink-body would beat text-ink
                      isSelected || isActive ? "text-ink" : "text-ink-body",
                      isActive ? "bg-surface-active/80" : "",
                    ].join(" ")}
                    style={{
                      animation: `select-option-in 300ms var(--ease-out-soft) ${40 + i * 22}ms both`,
                    }}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    {isSelected && (
                      <svg
                        aria-hidden
                        className="shrink-0 text-ink"
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </Portal>
        )}
      </div>

      {hint && <p className="text-[11.5px] text-ink-muted mt-0.5">{hint}</p>}
    </div>
  );
}
