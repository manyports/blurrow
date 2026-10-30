"use client";

import React, { useState, useRef, useEffect, useId } from "react";

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
  const [open, setOpen] = useState(false);
  // The list stays mounted while it folds away, and only unfolds once painted
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const close = () => {
    setOpen(false);
    setEntered(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMounted(false), 200);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
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
          className="text-[12.5px] font-medium text-neutral-700 tracking-[-0.005em]"
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
            "rounded-xl px-4 py-3 text-[13.5px] font-medium text-neutral-900",
            "field cursor-pointer select-none",
            "focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
          ].join(" ")}
          data-open={open || undefined}
        >
          <span
            id={`${uid}-value`}
            className={[
              "relative z-10 truncate",
              selected ? "text-neutral-900" : "text-neutral-400 font-normal",
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
              open ? "rotate-180 text-neutral-900" : "text-neutral-400 group-hover/select:text-neutral-700",
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
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                }}
              />
            </span>
          )}
        </button>

        {mounted && (
          <div
            className="absolute left-0 z-50 mt-2 p-1.5 rounded-[16px] origin-top"
            style={{
              minWidth: "100%",
              maxWidth: "min(420px, calc(100vw - 2rem))",
              width: "max-content",
              background: "var(--panel-bezel)",
              boxShadow: "var(--overlay-shadow)",
              /* Unfolds downward out of the field: a clip reveals it top to
                 bottom while it fades and settles. The clip's sides reach
                 past the panel so its shadow is never cut off.             */
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(-4px) scale(0.98)",
              clipPath: entered ? "inset(-48px -48px -48px -48px)" : "inset(-48px -48px 55% -48px)",
              transition: entered
                ? "opacity 180ms ease-out, transform 360ms var(--ease-out-soft), clip-path 360ms var(--ease-out-soft)"
                : "opacity 160ms ease-in, transform 200ms ease-in, clip-path 200ms ease-in",
            }}
          >
            <div
              ref={listRef}
              id={`${uid}-list`}
              role="listbox"
              aria-labelledby={label ? `${uid}-label` : undefined}
              className="bg-white rounded-[11px] p-1 flex flex-col gap-0.5 max-h-72 overflow-y-auto scroll-thin"
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
                      isSelected ? "font-medium text-neutral-900" : "text-neutral-600",
                      isActive ? "bg-neutral-100/80 text-neutral-900" : "",
                    ].join(" ")}
                    style={{
                      animation: `select-option-in 300ms var(--ease-out-soft) ${40 + i * 22}ms both`,
                    }}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    {isSelected && (
                      <svg
                        aria-hidden
                        className="shrink-0 text-neutral-900"
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
        )}
      </div>

      {hint && <p className="text-[11.5px] text-neutral-500 mt-0.5">{hint}</p>}
    </div>
  );
}
