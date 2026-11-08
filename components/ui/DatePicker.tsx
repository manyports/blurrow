"use client";

import React, { useId, useMemo, useRef, useState } from "react";
import { Portal } from "./Floating";
import { FieldKey, FieldLabel, FieldMessage } from "./FieldMessage";
import { useFloatingPanel } from "./useFloatingPanel";

/* ── Date helpers ─────────────────────────────────────────────────── */
/* Everything works on local calendar days at midnight, so a date never
   drifts across a time zone boundary on its way through the picker.  */
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();
export const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

/* ── Calendar ─────────────────────────────────────────────────────── */
interface CalendarProps {
  value?: Date | null;
  /** Shade a span of days instead of marking one (see DateRangePicker) */
  range?: DateRange;
  onChange?: (date: Date) => void;
  /** The day under the pointer or keyboard, for previewing a range */
  onDayHover?: (date: Date | null) => void;
  /** The month shown first; defaults to the selected date, or today */
  defaultMonth?: Date;
  /** How many months sit side by side */
  months?: 1 | 2;
  min?: Date;
  max?: Date;
  /** Grey out and skip particular days, like weekends */
  isDateDisabled?: (date: Date) => boolean;
  /** 0 is Sunday, 1 is Monday */
  weekStartsOn?: 0 | 1;
  locale?: string;
  /** Move focus onto the grid as soon as it mounts */
  autoFocus?: boolean;
  className?: string;
}

/* A month of days on the panel's face. The chosen day is a raised key in
   the inverse material, today wears a small dot, and the grid follows
   the ARIA date-grid pattern: arrows move by day and week, page keys by
   month (shift for a year), home and end to the edges of the week.  */
export function Calendar({
  value,
  range,
  onChange,
  onDayHover,
  defaultMonth,
  months = 1,
  min,
  max,
  isDateDisabled,
  weekStartsOn = 0,
  locale = "en-US",
  autoFocus = false,
  className = "",
}: CalendarProps) {
  const uid = useId();
  const [today] = useState(() => startOfDay(new Date()));
  const [focused, setFocused] = useState<Date>(() => startOfDay(value ?? range?.from ?? defaultMonth ?? today));
  const [view, setView] = useState<Date>(() => startOfMonth(focused));
  const [direction, setDirection] = useState<"left" | "right">("right");
  // Set by keyboard moves, spent by the next day button that mounts focused
  const pendingFocus = useRef(autoFocus);

  // A value set from outside brings its month into view
  const anchor = value ?? range?.from ?? null;
  const [seen, setSeen] = useState(anchor?.getTime());
  if (anchor?.getTime() !== seen) {
    setSeen(anchor?.getTime());
    if (anchor) {
      const d = startOfDay(anchor);
      setFocused(d);
      const shown = monthIndex(d) - monthIndex(view);
      if (shown < 0 || shown >= months) setView(startOfMonth(d));
    }
  }

  const minDay = min && startOfDay(min);
  const maxDay = max && startOfDay(max);
  const disabled = (d: Date) =>
    (minDay && d < minDay) || (maxDay && d > maxDay) || (isDateDisabled?.(d) ?? false);

  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    [locale],
  );
  const weekdays = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 2023-01-01 was a Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2023, 0, 1 + ((i + weekStartsOn) % 7));
      return { short: short.format(d).slice(0, 2), long: long.format(d) };
    });
  }, [locale, weekStartsOn]);

  /* Moves the roving focus, scrolling the view when the day is off it */
  const move = (next: Date, viaKeyboard: boolean) => {
    pendingFocus.current = viaKeyboard;
    const offset = monthIndex(next) - monthIndex(view);
    if (offset < 0) {
      setDirection("left");
      setView(startOfMonth(next));
    } else if (offset >= months) {
      setDirection("right");
      setView(startOfMonth(addMonths(next, -(months - 1))));
    }
    setFocused(next);
    if (viaKeyboard) onDayHover?.(next);
  };

  const flip = (n: number) => {
    pendingFocus.current = false;
    setDirection(n > 0 ? "right" : "left");
    setView(addMonths(view, n));
    setFocused(addMonths(focused, n));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dow = (focused.getDay() - weekStartsOn + 7) % 7;
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
      Home: () => addDays(focused, -dow),
      End: () => addDays(focused, 6 - dow),
    };
    if (map[e.key]) {
      e.preventDefault();
      move(map[e.key](), true);
    }
  };

  /* The focused day takes focus after it renders, but only when the
     keyboard moved it: a click shouldn't yank focus around.         */
  const focusRef = (el: HTMLButtonElement | null) => {
    if (!el || !pendingFocus.current) return;
    pendingFocus.current = false;
    el.focus({ preventScroll: true });
  };

  const prevDisabled = !!minDay && addDays(view, -1) < minDay;
  const nextDisabled = !!maxDay && addMonths(view, months) > maxDay;

  const from = range?.from ? startOfDay(range.from) : null;
  const to = range?.to ? startOfDay(range.to) : null;

  return (
    <div
      className={["flex flex-wrap justify-center gap-x-6 gap-y-4 select-none", className].join(" ")}
      onKeyDown={onKeyDown}
      onMouseLeave={() => onDayHover?.(null)}
    >
      {Array.from({ length: months }, (_, m) => {
        const month = addMonths(view, m);
        const first = startOfMonth(month);
        const gridStart = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7));
        // Always six weeks, so the panel keeps its height from month to month
        const weeks = Array.from({ length: 6 }, (_, w) =>
          Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)),
        );
        const labelId = `${uid}-month-${m}`;
        return (
          <div key={m} className="w-[266px]">
            <div className="mb-2 flex h-7 items-center justify-between gap-2">
              {m === 0 ? (
                <FieldKey label="previous month" disabled={prevDisabled} onClick={() => flip(-1)}>
                  <path d="M15 19l-7-7 7-7" />
                </FieldKey>
              ) : (
                <span className="w-7" />
              )}
              <span id={labelId} aria-live="polite" className="text-[13.5px] font-semibold text-ink tracking-[-0.01em]">
                {monthFmt.format(month)}
              </span>
              {m === months - 1 ? (
                <FieldKey label="next month" disabled={nextDisabled} onClick={() => flip(1)}>
                  <path d="M9 5l7 7-7 7" />
                </FieldKey>
              ) : (
                <span className="w-7" />
              )}
            </div>

            <div role="grid" aria-labelledby={labelId}>
              <div role="row" className="grid grid-cols-7">
                {weekdays.map((w) => (
                  <span
                    key={w.long}
                    role="columnheader"
                    aria-label={w.long}
                    className="grid h-7 place-items-center text-[11px] font-medium text-ink-faint"
                  >
                    {w.short}
                  </span>
                ))}
              </div>
              <div
                key={monthIndex(month)}
                className={direction === "right" ? "animate-tab-slide-right" : "animate-tab-slide-left"}
              >
                {weeks.map((week, wi) => (
                  <div role="row" key={wi} className="grid grid-cols-7">
                    {week.map((d) => {
                      const inMonth = d.getMonth() === month.getMonth();
                      // With two months the spill-over days would show twice
                      if (!inMonth && months > 1) {
                        return <div role="gridcell" key={d.getTime()} className="h-[38px]" />;
                      }
                      const isEndpoint = range ? sameDay(d, from) || sameDay(d, to) : sameDay(d, value);
                      const inBand = !!(from && to && d > from && d < to);
                      const bandLeft = !!(from && to && sameDay(d, to) && !sameDay(from, to));
                      const bandRight = !!(from && to && sameDay(d, from) && !sameDay(from, to));
                      const isToday = sameDay(d, today);
                      const isOff = disabled(d);
                      const isFocus = sameDay(d, focused) && inMonth;
                      return (
                        <div
                          role="gridcell"
                          key={d.getTime()}
                          aria-selected={isEndpoint || inBand}
                          className="relative grid h-[38px] place-items-center"
                        >
                          {/* The span of a range, cut into the face like a well */}
                          {(inBand || bandLeft || bandRight) && (
                            <span
                              aria-hidden
                              className="absolute inset-y-[3px]"
                              style={{
                                left: bandLeft || inBand ? 0 : "50%",
                                right: bandRight || inBand ? 0 : "50%",
                                background: "var(--well)",
                                boxShadow: "var(--well-shadow)",
                              }}
                            />
                          )}
                          <button
                            type="button"
                            ref={isFocus ? focusRef : undefined}
                            tabIndex={isFocus ? 0 : -1}
                            disabled={isOff}
                            aria-label={dayLabel.format(d)}
                            aria-current={isToday ? "date" : undefined}
                            onClick={() => {
                              move(d, false);
                              if (!isOff) onChange?.(d);
                            }}
                            onMouseEnter={() => onDayHover?.(d)}
                            className={[
                              "relative grid h-9 w-9 place-items-center rounded-[10px] text-[13px] tabular-nums",
                              "transition-[background-color,color,box-shadow] duration-150",
                              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink",
                              "disabled:cursor-not-allowed disabled:text-ink-ghost disabled:line-through",
                              isEndpoint
                                ? "font-semibold text-ink-inverse"
                                : [
                                    "cursor-pointer hover:bg-surface-active",
                                    !inMonth ? "text-ink-ghost" : isToday ? "font-semibold text-ink-strong" : "text-ink-soft",
                                  ].join(" "),
                            ].join(" ")}
                            style={
                              isEndpoint
                                ? {
                                    background: "var(--face-inverse)",
                                    boxShadow: "var(--face-inverse-shadow)",
                                    textShadow: "var(--emboss-inverse)",
                                  }
                                : undefined
                            }
                          >
                            {d.getDate()}
                            {isToday && (
                              <span
                                aria-hidden
                                className={[
                                  "absolute bottom-[5px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full",
                                  isEndpoint ? "bg-ink-inverse" : "bg-ink",
                                ].join(" ")}
                              />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Pieces both pickers share ────────────────────────────────────── */
export const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path strokeLinecap="round" d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export function ClearKey({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClear}
      className="absolute right-2.5 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface-active hover:text-ink-soft"
    >
      <svg aria-hidden width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

/* ── DatePicker ───────────────────────────────────────────────────── */
interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
  /** How the chosen date reads in the field */
  format?: Intl.DateTimeFormatOptions;
  /** Submit the date with a form, as yyyy-mm-dd */
  name?: string;
  /** Show a small key in the field that empties it */
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

/* The closed picker is a sunken field like Select; the calendar opens
   under it on a floating panel. Picking a day closes it and hands
   focus back to the field.                                         */
export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  label,
  hint,
  error,
  placeholder = "pick a date",
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  locale = "en-US",
  format = DEFAULT_FORMAT,
  name,
  clearable = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: DatePickerProps) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : internal;
  const { open, mounted, toggle, show, close, setFloating, panelStyle } = useFloatingPanel(ref, {
    onEscape: () => buttonRef.current?.focus(),
  });
  const messageId = error || hint ? `${uid}-message` : undefined;
  const text = selected ? new Intl.DateTimeFormat(locale, format).format(selected) : null;

  const set = (d: Date | null) => {
    setInternal(d);
    onChange?.(d);
  };

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && <FieldLabel id={`${uid}-label`}>{label}</FieldLabel>}
      <div ref={ref} className={["relative", fullWidth ? "w-full" : "inline-block w-56", className].join(" ")}>
        {/* The field's error styling keys off aria-invalid, as Input's does */}
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={toggle}
          onKeyDown={(e) => {
            if (!open && e.key === "ArrowDown") {
              e.preventDefault();
              show();
            }
          }}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? `${uid}-panel` : undefined}
          aria-labelledby={label ? `${uid}-label ${uid}-value` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          data-open={open || undefined}
          className={[
            "field group/date relative isolate flex w-full cursor-pointer items-center gap-2.5 rounded-xl py-3 pl-3.5 text-left text-[13.5px]",
            clearable && selected ? "pr-10" : "pr-4",
            "focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
          ].join(" ")}
        >
          <CalendarIcon
            className={[
              "shrink-0 transition-[color,transform] duration-300 ease-[var(--ease-spring)]",
              open ? "scale-110 text-ink-soft" : "text-ink-faint group-hover/date:text-ink-body",
            ].join(" ")}
          />
          <span
            id={`${uid}-value`}
            className={["truncate tabular-nums", text ? "font-medium text-ink" : "text-ink-faint"].join(" ")}
          >
            {text ?? placeholder}
          </span>
        </button>

        {clearable && selected && !disabled && (
          <ClearKey
            label="clear date"
            onClear={() => {
              set(null);
              buttonRef.current?.focus();
            }}
          />
        )}

        {name && <input type="hidden" name={name} value={selected ? toISODate(selected) : ""} />}
      </div>

      {mounted && (
        <Portal>
          <div
            ref={setFloating}
            id={`${uid}-panel`}
            role="dialog"
            aria-label={label ? `choose ${label}` : "choose a date"}
            className="rounded-[16px] p-1.5"
            style={panelStyle}
          >
            <div className="rounded-[11px] bg-panel-face p-2.5" style={{ boxShadow: "var(--panel-face-shadow)" }}>
              <Calendar
                value={selected}
                onChange={(d) => {
                  set(d);
                  close();
                  buttonRef.current?.focus();
                }}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                weekStartsOn={weekStartsOn}
                locale={locale}
                autoFocus
              />
            </div>
          </div>
        </Portal>
      )}
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
