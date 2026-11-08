"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Portal } from "./Floating";
import { FieldLabel, FieldMessage } from "./FieldMessage";
import { useFloatingPanel } from "./useFloatingPanel";

export interface ComboboxOption {
  value: string;
  label: string;
  /** A second, quieter line under the label */
  description?: string;
  /** Extra words to match on that aren't shown */
  keywords?: string[];
  disabled?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Shown when nothing matches */
  emptyText?: string;
  /** Replace the default "contains" match */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Show a key that empties the field */
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  name?: string;
  className?: string;
}

const defaultFilter = (o: ComboboxOption, q: string) => {
  const hay = [o.label, o.description ?? "", ...(o.keywords ?? [])].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
};

/* Bolds the part of the label that matched what was typed */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const at = q ? text.toLowerCase().indexOf(q) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent font-semibold text-ink">{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

/* A Select you can type into. The field filters the list as you go,
   arrows walk the matches, Enter picks one, and leaving the field puts
   the chosen label back if what you typed didn't match anything.     */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = "search…",
  label,
  hint,
  error,
  emptyText = "nothing matches",
  filter = defaultFilter,
  clearable = false,
  disabled = false,
  fullWidth = false,
  name,
  className = "",
}: ComboboxProps) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selectedValue = value !== undefined ? value : internal;
  const selected = options.find((o) => o.value === selectedValue) ?? null;
  const [query, setQuery] = useState<string | null>(null); // null: not typing, show the selection
  const [active, setActive] = useState(0);
  const { open, mounted, show, close, setFloating, panelStyle } = useFloatingPanel(ref, {
    matchWidth: true,
    onEscape: () => setQuery(null),
  });
  const messageId = error || hint ? `${uid}-message` : undefined;

  const matches = useMemo(
    () => (query ? options.filter((o) => filter(o, query)) : options),
    [options, query, filter],
  );

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const pick = (o: ComboboxOption | null) => {
    if (o?.disabled) return;
    setInternal(o?.value ?? null);
    onChange?.(o?.value ?? null);
    setQuery(null);
    close();
  };

  const openList = () => {
    if (open || disabled) return;
    const i = matches.findIndex((o) => o.value === selectedValue);
    setActive(Math.max(0, i));
    show();
  };

  const step = (dir: 1 | -1) => {
    if (!matches.length) return;
    let i = active;
    for (let n = 0; n < matches.length; n++) {
      i = (i + dir + matches.length) % matches.length;
      if (!matches[i].disabled) break;
    }
    setActive(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else step(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else step(-1);
        break;
      case "Enter":
        if (open && matches[active]) {
          e.preventDefault();
          pick(matches[active]);
        }
        break;
      case "Tab":
        if (open) close();
        break;
    }
  };

  const shownText = query ?? selected?.label ?? "";
  const showClear = clearable && !!selected && !disabled;

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && (
        <FieldLabel id={`${uid}-label`} htmlFor={`${uid}-input`}>
          {label}
        </FieldLabel>
      )}
      {/* Closed, it reads exactly like Select: the chosen label and a
          chevron. Focus it and it turns into a field you type into.  */}
      <div ref={ref} className={["group/combo relative isolate", fullWidth ? "w-full" : "w-60", className].join(" ")}>
        <input
          ref={inputRef}
          id={`${uid}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${uid}-opt-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={selected?.label ?? placeholder}
          value={shownText}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            if (!open) show();
          }}
          onClick={openList}
          // typing replaces the chosen label instead of adding to it
          onFocus={(e) => e.target.select()}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setQuery(null);
            if (open) close();
          }}
          data-open={open || undefined}
          className={[
            "field relative z-10 w-full rounded-xl py-3 pl-4 text-[13.5px] font-medium text-ink caret-ink",
            "placeholder:font-normal placeholder:text-ink-faint focus:placeholder:text-ink-ghost",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            open ? "cursor-text" : "cursor-pointer",
            showClear ? "pr-[60px]" : "pr-10",
          ].join(" ")}
        />

        {/* Input's sweep of light as the field comes up */}
        <span aria-hidden className="pointer-events-none absolute inset-0 z-15 overflow-hidden rounded-xl">
          <span
            className="absolute inset-y-0 -left-[30%] block w-[30%] opacity-0 group-focus-within/combo:animate-input-shimmer"
            style={{ background: "linear-gradient(90deg, transparent 0%, var(--shimmer) 50%, transparent 100%)" }}
          />
        </span>

        {showClear && (
          <button
            type="button"
            aria-label="clear"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(null)}
            className={[
              "absolute right-9 top-1/2 z-20 grid h-[18px] w-[18px] -translate-y-1/2 cursor-pointer place-items-center rounded-full",
              "text-ink-faint transition-[opacity,color,background-color] duration-150 hover:bg-surface-active hover:text-ink",
              "opacity-0 group-hover/combo:opacity-100 group-focus-within/combo:opacity-100",
            ].join(" ")}
          >
            <svg aria-hidden width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        <svg
          aria-hidden
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={[
            "pointer-events-none absolute right-4 top-1/2 z-20 -mt-[7px] transition-[transform,color] duration-300 ease-[var(--ease-spring)]",
            open ? "rotate-180 text-ink" : "text-ink-faint group-hover/combo:text-ink-label",
          ].join(" ")}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {name && <input type="hidden" name={name} value={selectedValue ?? ""} />}
      </div>

      {mounted && (
        <Portal>
          <div
            ref={setFloating}
            className="rounded-[16px] p-1.5"
            style={{ ...panelStyle, maxWidth: "min(420px, calc(100vw - 16px))" }}
          >
            <div
              ref={listRef}
              id={`${uid}-list`}
              role="listbox"
              aria-labelledby={label ? `${uid}-label` : undefined}
              // keeps focus in the field, even when the scrollbar is dragged
              onMouseDown={(e) => e.preventDefault()}
              className="flex max-h-72 flex-col gap-0.5 overflow-y-auto rounded-[11px] bg-panel-face p-1 scroll-thin"
              style={{ boxShadow: "var(--panel-face-shadow)" }}
            >
              {matches.length === 0 && (
                <div role="presentation" className="px-2.5 py-2 text-[13px] text-ink-faint">
                  {emptyText}
                </div>
              )}
              {matches.map((o, i) => {
                const isSel = o.value === selectedValue;
                const isActive = i === active;
                return (
                  <div
                    key={o.value}
                    id={`${uid}-opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isSel}
                    aria-disabled={o.disabled || undefined}
                    onClick={() => pick(o)}
                    onMouseMove={() => !o.disabled && setActive(i)}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-[8px] px-2.5 py-2 text-[13px] transition-colors duration-100",
                      o.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                      isSel ? "font-medium" : "",
                      // one ink per state, as in Select
                      isSel || isActive ? "text-ink" : "text-ink-body",
                      isActive ? "bg-surface-active/80" : "",
                    ].join(" ")}
                    style={{ animation: `select-option-in 300ms var(--ease-out-soft) ${40 + Math.min(i, 8) * 22}ms both` }}
                  >
                    <span className="flex min-w-0 flex-col gap-px">
                      <span className="truncate">
                        <Highlight text={o.label} query={query ?? ""} />
                      </span>
                      {o.description && <span className="truncate text-[11.5px] font-normal text-ink-faint">{o.description}</span>}
                    </span>
                    {isSel && (
                      <svg aria-hidden className="shrink-0 text-ink" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
