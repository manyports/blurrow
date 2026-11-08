"use client";

import React, { useId, useRef, useState } from "react";
import { FieldLabel } from "./FieldMessage";

type SliderValue = number | [number, number];

interface SliderProps<V extends SliderValue> {
  /** One number for a slider, two for a range */
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  /** Fires once the knob is let go, for work too heavy to do while dragging */
  onCommit?: (value: V) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Show the value beside the label; pass a function to format it */
  showValue?: boolean | ((value: V) => React.ReactNode);
  /** Small labels under the track, at these values */
  marks?: number[];
  disabled?: boolean;
  /** Name of a hidden input (two for a range: name[0], name[1]) */
  name?: string;
  className?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

/* A sunken track with the filled part in the inverse material, and a
   raised knob (or two, for a range) that you drag along it. The knob
   swells while held; arrows step, shift steps by ten, page keys by a
   tenth of the range, home and end jump to the ends.               */
export function Slider<V extends SliderValue = number>({
  value,
  defaultValue,
  onChange,
  onCommit,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  marks,
  disabled = false,
  name,
  className = "",
}: SliderProps<V>) {
  const uid = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const knobs = useRef<(HTMLSpanElement | null)[]>([]);
  const isRange = Array.isArray(value ?? defaultValue);
  const [internal, setInternal] = useState<V>(() => (defaultValue ?? value ?? (min as V)) as V);
  const current = (value !== undefined ? value : internal) as V;
  const values: number[] = Array.isArray(current) ? [...current] : [current as number];
  const [dragging, setDragging] = useState<number | null>(null);
  const digits = decimals(step);

  const snap = (n: number) => Number(clamp(Math.round((n - min) / step) * step + min, min, max).toFixed(digits));
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  const emit = (next: number[], commit = false) => {
    const v = (isRange ? [next[0], next[1]] : next[0]) as V;
    setInternal(v);
    if (next.some((n, i) => n !== values[i])) onChange?.(v);
    if (commit) onCommit?.(v);
  };

  /* Each knob is kept on its own side of the other */
  const setAt = (i: number, n: number, commit = false) => {
    const next = [...values];
    next[i] = snap(n);
    if (isRange) next[i] = i === 0 ? Math.min(next[0], values[1]) : Math.max(next[1], values[0]);
    emit(next, commit);
  };

  const fromPointer = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return min + clamp((clientX - r.left) / r.width, 0, 1) * (max - min);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    const n = fromPointer(e.clientX);
    // Grab whichever knob is nearer; on a tie, the one that can move that way
    let i = 0;
    if (isRange) {
      const d0 = Math.abs(n - values[0]);
      const d1 = Math.abs(n - values[1]);
      i = d1 < d0 || (d0 === d1 && n > values[1]) ? 1 : 0;
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(i);
    knobs.current[i]?.focus();
    setAt(i, n);
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    const big = Math.max(step, (max - min) / 10);
    const moves: Record<string, number> = {
      ArrowRight: step * (e.shiftKey ? 10 : 1),
      ArrowUp: step * (e.shiftKey ? 10 : 1),
      ArrowLeft: -step * (e.shiftKey ? 10 : 1),
      ArrowDown: -step * (e.shiftKey ? 10 : 1),
      PageUp: big,
      PageDown: -big,
    };
    if (e.key in moves) {
      e.preventDefault();
      setAt(i, values[i] + moves[e.key], true);
    } else if (e.key === "Home") {
      e.preventDefault();
      setAt(i, min, true);
    } else if (e.key === "End") {
      e.preventDefault();
      setAt(i, max, true);
    }
  };

  const shown =
    typeof showValue === "function"
      ? showValue(current)
      : showValue
        ? values.join(" – ")
        : null;

  const lo = isRange ? pct(values[0]) : 0;
  const hi = pct(values[isRange ? 1 : 0]);

  return (
    <div className={["flex w-full flex-col gap-2.5", disabled ? "opacity-40" : "", className].join(" ")}>
      {(label || shown !== null) && (
        <div className="flex items-center justify-between gap-4">
          {label && <FieldLabel id={`${uid}-label`}>{label}</FieldLabel>}
          {shown !== null && <span className="text-[12.5px] tabular-nums text-ink-muted">{shown}</span>}
        </div>
      )}

      <div
        className={["relative flex h-6 touch-none items-center", disabled ? "pointer-events-none" : "cursor-pointer"].join(" ")}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging !== null && setAt(dragging, fromPointer(e.clientX))}
        onPointerUp={() => {
          if (dragging !== null) onCommit?.(current);
          setDragging(null);
        }}
        onPointerCancel={() => setDragging(null)}
      >
        {/* The track: a groove cut into the surface */}
        <div
          ref={trackRef}
          className="relative h-2 w-full rounded-full"
          style={{ background: "var(--track)", boxShadow: "var(--track-shadow)" }}
        >
          <div
            className="absolute inset-y-px rounded-full"
            style={{
              left: `calc(${lo}% + ${isRange ? 0 : 1}px)`,
              width: `calc(${hi - lo}% - ${isRange ? 0 : 1}px)`,
              background: "var(--face-inverse)",
              boxShadow: "var(--fill-shadow)",
              transition: dragging === null ? "left 200ms var(--ease-out-soft), width 200ms var(--ease-out-soft)" : "none",
            }}
          />
        </div>

        {values.map((v, i) => (
          <span
            key={i}
            ref={(el) => {
              knobs.current[i] = el;
            }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-labelledby={label ? `${uid}-label` : undefined}
            aria-label={isRange ? (i === 0 ? "minimum" : "maximum") : label ? undefined : "value"}
            aria-valuemin={isRange && i === 1 ? values[0] : min}
            aria-valuemax={isRange && i === 0 ? values[1] : max}
            aria-valuenow={v}
            aria-disabled={disabled || undefined}
            onKeyDown={onKeyDown(i)}
            className="absolute top-1/2 h-5 w-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            style={{
              left: `${pct(v)}%`,
              // the last-dragged knob of a range sits on top, so two at one spot can be pulled apart
              zIndex: dragging === i ? 2 : 1,
              background: "var(--face)",
              boxShadow: "var(--knob-shadow)",
              transform: `translate(-50%, -50%) scale(${dragging === i ? 1.15 : 1})`,
              transition:
                dragging === null
                  ? "left 200ms var(--ease-out-soft), transform 220ms var(--ease-spring)"
                  : "transform 220ms var(--ease-spring)",
            }}
          >
            {/* A small dimple on the knob's crown */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "var(--track)", boxShadow: "var(--track-shadow)" }}
            />
          </span>
        ))}
      </div>

      {marks && marks.length > 0 && (
        <div aria-hidden className="relative h-4">
          {marks.map((m) => (
            <span
              key={m}
              className="absolute -translate-x-1/2 text-[11px] tabular-nums text-ink-faint"
              style={{ left: `${pct(m)}%` }}
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {name &&
        values.map((v, i) => (
          <input key={i} type="hidden" name={isRange ? `${name}[${i}]` : name} value={v} />
        ))}
    </div>
  );
}
