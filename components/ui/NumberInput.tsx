"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { FieldKey, FieldLabel, FieldMessage } from "./FieldMessage";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type" | "size" | "prefix"> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Digits after the decimal point; inferred from `step` when left out */
  precision?: number;
  label?: string;
  hint?: string;
  error?: string;
  /** A unit shown before or after the number, like "$" or "kg" */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
}

const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

/* A sunken field with two small raised keys at its right edge. The keys
   repeat while held, arrow keys step (shift for ten at a time), and
   whatever you type is clamped and rounded when you leave the field.  */
export function NumberInput({
  value,
  defaultValue = null,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  label,
  hint,
  error,
  prefix,
  suffix,
  fullWidth = false,
  disabled,
  className = "",
  id,
  onBlur,
  onKeyDown,
  ...rest
}: NumberInputProps) {
  const uid = useId();
  const inputId = id ?? `${uid}-input`;
  const messageId = error || hint ? `${inputId}-message` : undefined;
  const digits = precision ?? decimals(step);

  const [internal, setInternal] = useState<number | null>(defaultValue);
  const current = value !== undefined ? value : internal;
  const format = (n: number | null) => (n === null ? "" : n.toFixed(digits));
  const [draft, setDraft] = useState(format(current));
  const editing = useRef(false);

  // Follow the controlled value unless someone is mid-way through typing
  useEffect(() => {
    if (!editing.current) setDraft(format(current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, digits]);

  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(digits))));

  // The hold-to-repeat timer reads the newest value from here, not a stale render
  const latest = useRef(current);
  useEffect(() => {
    latest.current = current;
  }, [current]);

  const commit = (n: number | null) => {
    const next = n === null || Number.isNaN(n) ? null : clamp(n);
    const prev = latest.current;
    latest.current = next;
    setInternal(next);
    setDraft(format(next));
    if (next !== prev) onChange?.(next);
  };

  // An empty field starts from zero, or from the nearest edge of the range
  const nudge = (dir: 1 | -1, times = 1) => {
    const base = latest.current;
    commit(base === null ? clamp(0) : base + dir * step * times);
  };

  const hold = useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval> }>({});
  const stopHold = () => {
    clearTimeout(hold.current.t);
    clearInterval(hold.current.i);
  };
  useEffect(() => stopHold, []);
  const startHold = (dir: 1 | -1) => {
    stopHold();
    nudge(dir);
    hold.current.t = setTimeout(() => {
      hold.current.i = setInterval(() => nudge(dir), 60);
    }, 400);
  };

  const atMin = current !== null && current <= min;
  const atMax = current !== null && current >= max;

  return (
    <div className={["group/field flex flex-col gap-1.5", fullWidth ? "w-full" : ""].join(" ")}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className={["relative isolate", fullWidth ? "w-full" : "w-40", className].join(" ")}>
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-20 -translate-y-1/2 text-[13.5px] text-ink-faint transition-colors duration-200 group-focus-within/field:text-ink-label">
            {prefix}
          </span>
        )}
        <input
          {...rest}
          id={inputId}
          type="text"
          inputMode={digits > 0 || min < 0 ? "decimal" : "numeric"}
          autoComplete="off"
          role="spinbutton"
          aria-valuenow={current ?? undefined}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          disabled={disabled}
          value={draft}
          onChange={(e) => {
            editing.current = true;
            setDraft(e.target.value.replace(/[^\d.,\-]/g, ""));
          }}
          onBlur={(e) => {
            editing.current = false;
            const raw = draft.replace(",", ".").trim();
            commit(raw === "" || raw === "-" ? null : parseFloat(raw));
            onBlur?.(e);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            const big = e.shiftKey ? 10 : 1;
            if (e.key === "ArrowUp") { e.preventDefault(); editing.current = false; nudge(1, big); }
            else if (e.key === "ArrowDown") { e.preventDefault(); editing.current = false; nudge(-1, big); }
            else if (e.key === "PageUp") { e.preventDefault(); nudge(1, 10); }
            else if (e.key === "PageDown") { e.preventDefault(); nudge(-1, 10); }
            else if (e.key === "Home" && Number.isFinite(min)) { e.preventDefault(); commit(min); }
            else if (e.key === "End" && Number.isFinite(max)) { e.preventDefault(); commit(max); }
            else if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); (e.target as HTMLInputElement).focus(); }
          }}
          className={[
            "field relative z-10 w-full rounded-xl py-3 text-[13.5px] tabular-nums text-ink caret-ink",
            "placeholder:text-ink-faint focus:placeholder:text-ink-ghost",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            prefix ? "pl-8" : "pl-4",
            suffix ? "pr-[92px]" : "pr-[64px]",
          ].join(" ")}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-[64px] top-1/2 z-20 -translate-y-1/2 text-[12.5px] text-ink-faint">
            {suffix}
          </span>
        )}
        <div
          className={[
            "absolute right-1.5 top-1/2 z-20 flex -translate-y-1/2 gap-1",
            disabled ? "opacity-40 pointer-events-none" : "",
          ].join(" ")}
        >
          <FieldKey label="decrease" focusable={false} disabled={atMin} onPress={() => startHold(-1)} onRelease={stopHold}>
            <path d="M5 12h14" />
          </FieldKey>
          <FieldKey label="increase" focusable={false} disabled={atMax} onPress={() => startHold(1)} onRelease={stopHold}>
            <path d="M12 5v14M5 12h14" />
          </FieldKey>
        </div>
      </div>
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
