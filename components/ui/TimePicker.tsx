"use client";

import React, { useId, useRef, useState } from "react";
import { ClearKey } from "./DatePicker";
import { Portal } from "./Floating";
import { FieldLabel, FieldMessage } from "./FieldMessage";
import { useFloatingPanel } from "./useFloatingPanel";

interface TimePickerProps {
  /** 24-hour "HH:mm", like "14:30" */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (time: string | null) => void;
  /** Minutes between choices in the minute column */
  step?: number;
  /** Show 1–12 with am / pm instead of 0–23 */
  hour12?: boolean;
  /** Earliest and latest times, as "HH:mm" */
  min?: string;
  max?: string;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  name?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const toMinutes = (t?: string | null) => {
  if (!t) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
const fromMinutes = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

export function formatTime(t: string, hour12: boolean) {
  const m = toMinutes(t);
  if (m === null) return t;
  const h = Math.floor(m / 60);
  return hour12 ? `${h % 12 || 12}:${pad(m % 60)} ${h < 12 ? "am" : "pm"}` : fromMinutes(m);
}

type Column = "hour" | "minute" | "period";

/* A field that opens a panel of columns: hours, minutes and, for a
   12-hour clock, am / pm. The chosen cell in each is a raised key in the
   inverse material. Arrows move within a column and between columns;
   Enter or picking a minute closes it.                              */
export function TimePicker({
  value,
  defaultValue = null,
  onChange,
  step = 15,
  hour12 = false,
  min,
  max,
  label,
  hint,
  error,
  placeholder = "pick a time",
  clearable = false,
  disabled = false,
  fullWidth = false,
  name,
  className = "",
}: TimePickerProps) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const current = value !== undefined ? value : internal;
  const total = toMinutes(current);
  const { open, mounted, toggle, close, setFloating, panelStyle } = useFloatingPanel(ref, {
    onEscape: () => buttonRef.current?.focus(),
  });
  const messageId = error || hint ? `${uid}-message` : undefined;

  const lo = toMinutes(min) ?? 0;
  const hi = toMinutes(max) ?? 24 * 60 - 1;
  const hour = total === null ? null : Math.floor(total / 60);
  const minute = total === null ? null : total % 60;

  const set = (t: string | null) => {
    setInternal(t);
    onChange?.(t);
  };

  /* Picks a time, nudging the minutes into range when the hour changes */
  const choose = (h: number, m: number) => {
    let t = h * 60 + m;
    if (t < lo) t = lo;
    if (t > hi) t = hi;
    set(fromMinutes(t));
  };

  const hours = hour12 ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step).filter((m) => m < 60);
  const isPm = hour !== null && hour >= 12;
  const to24 = (h12: number, pm: boolean) => (h12 % 12) + (pm ? 12 : 0);

  const hourOff = (h24: number) => h24 * 60 + 59 < lo || h24 * 60 > hi;
  const minuteOff = (m: number) => hour !== null && (hour * 60 + m < lo || hour * 60 + m > hi);

  type Cell = { key: string; label: string; selected: boolean; off: boolean; pick: () => void };
  const columns: { id: Column; label: string; cells: Cell[] }[] = [
    {
      id: "hour",
      label: "hour",
      cells: hours.map((h) => {
        const h24 = hour12 ? to24(h, isPm) : h;
        return {
          key: `h${h}`,
          label: hour12 ? String(h) : pad(h),
          selected: hour === h24,
          off: hourOff(h24),
          pick: () => choose(h24, minute ?? 0),
        };
      }),
    },
    {
      id: "minute",
      label: "minute",
      cells: minutes.map((m) => ({
        key: `m${m}`,
        label: pad(m),
        selected: minute === m,
        off: minuteOff(m),
        pick: () => {
          choose(hour ?? Math.floor(lo / 60), m);
          close();
          buttonRef.current?.focus();
        },
      })),
    },
  ];
  if (hour12) {
    columns.push({
      id: "period",
      label: "am or pm",
      cells: (["am", "pm"] as const).map((p) => {
        const pm = p === "pm";
        const h24 = to24(hour === null ? 12 : hour % 12 || 12, pm);
        return {
          key: p,
          label: p,
          selected: hour !== null && isPm === pm,
          off: pm ? hi < 12 * 60 : lo >= 12 * 60,
          pick: () => choose(h24, minute ?? 0),
        };
      }),
    });
  }

  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* Each column scrolls its chosen cell into the middle when it mounts */
  const attachColumn = (id: Column) => (el: HTMLDivElement | null) => {
    colRefs.current[id] = el;
    const sel = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || el.dataset.scrolled) return;
    el.dataset.scrolled = "1";
    if (sel) el.scrollTop = sel.offsetTop - el.clientHeight / 2 + sel.offsetHeight / 2;
    // The panel lives at the end of <body>, so focus goes to it rather than waiting for Tab
    if (id === "hour") el.focus({ preventScroll: true });
  };

  const onColumnKey = (ci: number) => (e: React.KeyboardEvent) => {
    const col = columns[ci];
    const enabled = col.cells.map((c, i) => (c.off ? -1 : i)).filter((i) => i >= 0);
    const at = col.cells.findIndex((c) => c.selected);
    const pos = enabled.indexOf(at);
    const focusCol = (n: number) =>
      colRefs.current[columns[Math.max(0, Math.min(columns.length - 1, n))].id]?.focus();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const d = e.key === "ArrowDown" ? 1 : -1;
      const next = enabled[pos < 0 ? 0 : (pos + d + enabled.length) % enabled.length];
      // the minute column closes on pick; from the keyboard, just move
      if (col.id === "minute") choose(hour ?? Math.floor(lo / 60), minutes[next]);
      else col.cells[next]?.pick();
      requestAnimationFrame(() =>
        colRefs.current[col.id]?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }),
      );
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusCol(ci + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusCol(ci - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      close();
      buttonRef.current?.focus();
    }
  };

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && <FieldLabel id={`${uid}-label`}>{label}</FieldLabel>}
      <div ref={ref} className={["relative", fullWidth ? "w-full" : "inline-block w-44", className].join(" ")}>
        {/* The field's error styling keys off aria-invalid, as Input's does */}
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={label ? `${uid}-label ${uid}-value` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          data-open={open || undefined}
          className={[
            "field group/time relative isolate flex w-full cursor-pointer items-center gap-2.5 rounded-xl py-3 pl-3.5 text-left text-[13.5px]",
            clearable && current ? "pr-10" : "pr-4",
            "focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
          ].join(" ")}
        >
          <svg
            aria-hidden
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
            className={[
              "shrink-0 transition-[color,transform] duration-300 ease-[var(--ease-spring)]",
              open ? "scale-110 text-ink-soft" : "text-ink-faint group-hover/time:text-ink-body",
            ].join(" ")}
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span id={`${uid}-value`} className={["tabular-nums", current ? "font-medium text-ink" : "text-ink-faint"].join(" ")}>
            {current ? formatTime(current, hour12) : placeholder}
          </span>
        </button>
        {clearable && current && !disabled && (
          <ClearKey
            label="clear time"
            onClear={() => {
              set(null);
              buttonRef.current?.focus();
            }}
          />
        )}
        {name && <input type="hidden" name={name} value={current ?? ""} />}
      </div>

      {mounted && (
        <Portal>
          <div
            ref={setFloating}
            role="dialog"
            aria-label={label ? `choose ${label}` : "choose a time"}
            className="rounded-[16px] p-1.5"
            style={panelStyle}
          >
            <div className="flex gap-1 rounded-[11px] bg-panel-face p-1.5" style={{ boxShadow: "var(--panel-face-shadow)" }}>
              {columns.map((col, ci) => (
                <div
                  key={col.id}
                  ref={attachColumn(col.id)}
                  role="listbox"
                  aria-label={col.label}
                  tabIndex={0}
                  onKeyDown={onColumnKey(ci)}
                  className="flex max-h-56 w-14 flex-col gap-0.5 overflow-y-auto rounded-[9px] p-0.5 scroll-thin outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  style={{ scrollbarWidth: "none" }}
                >
                  {col.cells.map((c) => (
                    <div
                      key={c.key}
                      role="option"
                      aria-selected={c.selected}
                      aria-disabled={c.off || undefined}
                      onClick={() => !c.off && c.pick()}
                      className={[
                        "grid h-8 shrink-0 place-items-center rounded-[8px] text-[13px] tabular-nums transition-colors duration-100",
                        c.off
                          ? "cursor-not-allowed text-ink-ghost"
                          : c.selected
                            ? "cursor-pointer font-semibold text-ink-inverse"
                            : "cursor-pointer text-ink-body hover:bg-surface-active hover:text-ink",
                      ].join(" ")}
                      style={
                        c.selected && !c.off
                          ? {
                              background: "var(--face-inverse)",
                              boxShadow: "var(--face-inverse-shadow)",
                              textShadow: "var(--emboss-inverse)",
                            }
                          : undefined
                      }
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Portal>
      )}
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
