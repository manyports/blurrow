"use client";

import React, { useId, useRef, useState } from "react";
import { Calendar, CalendarIcon, ClearKey, DateRange, sameDay, startOfDay, toISODate } from "./DatePicker";
import { Portal } from "./Floating";
import { FieldLabel, FieldMessage } from "./FieldMessage";
import { useFloatingPanel } from "./useFloatingPanel";

export type { DateRange };

export interface DateRangePreset {
  label: string;
  range: () => DateRange;
}

interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
  /** Shortcuts down the side, like "last 7 days" */
  presets?: DateRangePreset[];
  /** One month instead of two side by side */
  singleMonth?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Submits name[from] and name[to] as yyyy-mm-dd */
  name?: string;
  className?: string;
}

const EMPTY: DateRange = { from: null, to: null };

/* The first click sets where the range starts, the second where it ends
   (either way round), and the days between sink into a well as you hover.
   Two months sit side by side, wrapping to one above the other on a
   narrow screen.                                                    */
export function DateRangePicker({
  value,
  defaultValue = EMPTY,
  onChange,
  label,
  hint,
  error,
  placeholder = "pick dates",
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  locale = "en-US",
  presets,
  singleMonth = false,
  clearable = false,
  disabled = false,
  fullWidth = false,
  name,
  className = "",
}: DateRangePickerProps) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState<DateRange>(defaultValue);
  const range = value ?? internal;
  // Mid-selection: the start is down, the end follows the pointer
  const [draft, setDraft] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const { open, mounted, toggle, close, setFloating, panelStyle } = useFloatingPanel(ref, {
    onEscape: () => buttonRef.current?.focus(),
  });
  const messageId = error || hint ? `${uid}-message` : undefined;

  // Reset a half-made selection whenever the panel closes
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) {
      setDraft(null);
      setHover(null);
    }
  }

  const set = (r: DateRange) => {
    setInternal(r);
    onChange?.(r);
  };

  const pickDay = (d: Date) => {
    if (!draft) {
      setDraft(d);
      return;
    }
    const [from, to] = d < draft ? [d, draft] : [draft, d];
    set({ from, to });
    setDraft(null);
    close();
    buttonRef.current?.focus();
  };

  // What the calendar shades: the finished range, or the one being drawn
  const shown: DateRange = draft
    ? hover && !sameDay(hover, draft)
      ? hover < draft
        ? { from: hover, to: draft }
        : { from: draft, to: hover }
      : { from: draft, to: draft }
    : range;

  const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" });
  const text =
    range.from && range.to
      ? // formatRange drops the repeated month and year: "Aug 3 – 12, 2028"
        fmt.formatRange(range.from, range.to)
      : range.from
        ? `${fmt.format(range.from)} –`
        : null;

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && <FieldLabel id={`${uid}-label`}>{label}</FieldLabel>}
      <div ref={ref} className={["relative", fullWidth ? "w-full" : "inline-block w-72", className].join(" ")}>
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
            "field group/date relative isolate flex w-full cursor-pointer items-center gap-2.5 rounded-xl py-3 pl-3.5 text-left text-[13.5px]",
            clearable && range.from ? "pr-10" : "pr-4",
            "focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
          ].join(" ")}
        >
          <CalendarIcon
            className={[
              "shrink-0 transition-[color,transform] duration-300 ease-[var(--ease-spring)]",
              open ? "scale-110 text-ink-soft" : "text-ink-faint group-hover/date:text-ink-body",
            ].join(" ")}
          />
          <span id={`${uid}-value`} className={["truncate tabular-nums", text ? "font-medium text-ink" : "text-ink-faint"].join(" ")}>
            {text ?? placeholder}
          </span>
        </button>
        {clearable && range.from && !disabled && (
          <ClearKey
            label="clear dates"
            onClear={() => {
              set(EMPTY);
              buttonRef.current?.focus();
            }}
          />
        )}
        {name && (
          <>
            <input type="hidden" name={`${name}[from]`} value={range.from ? toISODate(range.from) : ""} />
            <input type="hidden" name={`${name}[to]`} value={range.to ? toISODate(range.to) : ""} />
          </>
        )}
      </div>

      {mounted && (
        <Portal>
          <div
            ref={setFloating}
            role="dialog"
            aria-label={label ? `choose ${label}` : "choose dates"}
            className="max-w-[calc(100vw-16px)] rounded-[16px] p-1.5"
            style={panelStyle}
          >
            <div
              className="flex flex-col gap-3 rounded-[11px] bg-panel-face p-2.5 sm:flex-row"
              style={{ boxShadow: "var(--panel-face-shadow)" }}
            >
              {presets && presets.length > 0 && (
                <div className="flex shrink-0 flex-row flex-wrap gap-1 border-line-strong pb-2 sm:w-32 sm:flex-col sm:border-r sm:pb-0 sm:pr-2">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        const r = p.range();
                        set({ from: r.from && startOfDay(r.from), to: r.to && startOfDay(r.to) });
                        close();
                        buttonRef.current?.focus();
                      }}
                      className="cursor-pointer rounded-[8px] px-2.5 py-1.5 text-left text-[12.5px] text-ink-body transition-colors hover:bg-surface-active hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Calendar
                  range={shown}
                  onChange={pickDay}
                  onDayHover={setHover}
                  months={singleMonth ? 1 : 2}
                  min={min}
                  max={max}
                  isDateDisabled={isDateDisabled}
                  weekStartsOn={weekStartsOn}
                  locale={locale}
                  autoFocus
                />
                <p aria-live="polite" className="px-1 text-[11.5px] text-ink-faint">
                  {draft ? "now pick the last day" : "pick the first day"}
                </p>
              </div>
            </div>
          </div>
        </Portal>
      )}
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
