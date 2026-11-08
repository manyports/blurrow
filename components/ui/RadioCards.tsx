"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";


export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  /** Something on the right of the title, like a price */
  aside?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface RadioCardsProps {
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Read out as the group's name */
  label?: string;
  /** Options per row from the small breakpoint up; they stack on phones */
  columns?: 1 | 2 | 3;
  name?: string;
  className?: string;
}

const COLS = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as const;

// RadioGroup's timings: the leading edge leaves at once, the trailing
// edge follows a beat later on a spring and settles into place
const LEAD = "260ms var(--ease-out-soft)";
const TRAIL = "480ms cubic-bezier(0.34, 1.25, 0.64, 1) 50ms";

/* Bigger choices, like a plan or a delivery speed: the segmented control
   from Tabs, grown up. The options sit flat in one sunken well and a
   single raised thumb flows to whichever is chosen, across rows and
   columns: its leading edge goes first and the trailing edge catches
   up, so it stretches toward the new option the way RadioGroup's
   selection does, and you can see which way it went. Each keeps RadioGroup's own control on its right, so the two
   read as one family. One Tab stop, arrows move.                    */
export function RadioCards({
  options,
  value,
  defaultValue = "",
  onChange,
  label,
  columns = 1,
  name,
  className = "",
}: RadioCardsProps) {
  const uid = useId();
  const [internal, setInternal] = useState(defaultValue);
  const selected = value !== undefined ? value : internal;
  const wellRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbRef = useRef<HTMLSpanElement>(null);
  // Where the thumb last landed, to tell which way the next move goes
  const last = useRef<{ top: number; left: number } | null>(null);

  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const tabStop = selectedIndex >= 0 ? selectedIndex : enabled[0];

  const selectedRef = useRef(selectedIndex);

  /* The thumb is held by its four edges, measured from the well's, and
     written straight onto it, so a move never re-renders anything.
     Heading forward on an axis, the far edge leads and the near one
     trails on a spring; heading back, the other way round.          */
  const place = (index: number, animate: boolean) => {
    const thumb = thumbRef.current;
    const el = refs.current[index];
    const well = wellRef.current;
    if (!thumb || !well) return;
    if (!el) {
      thumb.style.opacity = "0";
      last.current = null;
      return;
    }
    const top = el.offsetTop;
    const left = el.offsetLeft;
    const from = animate ? last.current : null;
    const edge = (d: number, near: string, far: string) =>
      d === 0 ? [] : d > 0 ? [`${near} ${TRAIL}`, `${far} ${LEAD}`] : [`${near} ${LEAD}`, `${far} ${TRAIL}`];
    const dy = from ? Math.sign(top - from.top) : 0;
    const dx = from ? Math.sign(left - from.left) : 0;
    thumb.style.transition = [...edge(dy, "top", "bottom"), ...edge(dx, "left", "right")].join(", ") || "none";
    thumb.style.top = `${top}px`;
    thumb.style.left = `${left}px`;
    thumb.style.right = `${well.clientWidth - left - el.offsetWidth}px`;
    thumb.style.bottom = `${well.clientHeight - top - el.offsetHeight}px`;
    thumb.style.opacity = "1";
    last.current = { top, left };
  };

  // Before paint, so the thumb is never seen out of place
  useLayoutEffect(() => {
    selectedRef.current = selectedIndex;
    place(selectedIndex, true);
  }, [selectedIndex]);

  // Rewrapped text or a new breakpoint moves the options; follow them
  // without animating. An observer reports once as soon as it's attached;
  // that one is skipped, or it would cut short a move already under way.
  useEffect(() => {
    const well = wellRef.current;
    if (!well) return;
    let attached = false;
    const ro = new ResizeObserver(() => {
      if (attached) place(selectedRef.current, false);
      attached = true;
    });
    ro.observe(well);
    return () => ro.disconnect();
  }, []);

  const select = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    setInternal(o.value);
    onChange?.(o.value);
  };

  const move = (from: number, step: 1 | -1) => {
    const at = enabled.indexOf(from);
    const next = enabled[(at + step + enabled.length) % enabled.length];
    refs.current[next]?.focus();
    select(next);
  };

  return (
    <div
      ref={wellRef}
      role="radiogroup"
      aria-label={label}
      className={["relative grid grid-cols-1 gap-1 rounded-[18px] p-1.5", COLS[columns], className].join(" ")}
      style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
    >
      <span
        ref={thumbRef}
        aria-hidden
        className="pointer-events-none absolute rounded-[13px] opacity-0"
        style={{ background: "var(--face)", boxShadow: "var(--thumb-shadow)" }}
      />

      {options.map((o, i) => {
        const on = i === selectedIndex;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-labelledby={`${uid}-${i}-label`}
            aria-describedby={o.description ? `${uid}-${i}-desc` : undefined}
            disabled={o.disabled}
            tabIndex={i === tabStop ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                move(i, 1);
              } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                move(i, -1);
              }
            }}
            className={[
              "group/card relative z-10 flex items-start gap-3 rounded-[13px] px-4 py-3.5 text-left",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              on ? "cursor-default" : "cursor-pointer",
            ].join(" ")}
          >
            {o.icon && (
              <span
                aria-hidden
                className={[
                  "mt-px flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200",
                  on ? "text-ink" : "text-ink-faint group-hover/card:text-ink-body",
                ].join(" ")}
              >
                {o.icon}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-baseline justify-between gap-3">
                <span
                  id={`${uid}-${i}-label`}
                  className={[
                    "text-[13.5px] font-medium leading-snug transition-colors duration-150",
                    on ? "text-ink" : "text-ink-soft group-hover/card:text-ink",
                  ].join(" ")}
                >
                  {o.label}
                </span>
                {o.aside && (
                  <span
                    className={[
                      "shrink-0 text-[13px] tabular-nums transition-colors duration-150",
                      on ? "font-medium text-ink" : "text-ink-muted",
                    ].join(" ")}
                  >
                    {o.aside}
                  </span>
                )}
              </span>
              {o.description && (
                <span id={`${uid}-${i}-desc`} className="text-[12px] leading-relaxed text-ink-muted">
                  {o.description}
                </span>
              )}
            </span>
            {/* RadioGroup's control: a sunken well, and when chosen a face in
                the inverse material with a dot pressed into it */}
            <span
              aria-hidden
              className={[
                "relative mt-px h-[18px] w-[18px] shrink-0 rounded-full transition-[box-shadow] duration-200",
                on ? "" : "group-hover/card:[box-shadow:var(--field-shadow-hover)]",
              ].join(" ")}
              style={{ background: "var(--field)", boxShadow: "var(--field-shadow)" }}
            >
              <span
                className="absolute inset-0 grid place-items-center rounded-full transition-[opacity,transform] duration-300 ease-[var(--ease-spring)]"
                style={{
                  background: "var(--face-inverse)",
                  boxShadow: "var(--face-inverse-shadow)",
                  opacity: on ? 1 : 0,
                  transform: on ? "scale(1)" : "scale(0.4)",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink-inverse" style={{ boxShadow: "var(--dot-shadow)" }} />
              </span>
            </span>
          </button>
        );
      })}
      {name && <input type="hidden" name={name} value={selected} />}
    </div>
  );
}
