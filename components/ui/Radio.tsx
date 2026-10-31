"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

/* Every radio is a sunken field; the selection is one dark face that
   flows between them. Its leading edge leaves first and the trailing edge
   catches up on a spring, so it stretches across the gap like a drop of
   liquid and settles into the new well. One Tab stop for the group,
   arrows move between options (ARIA radio group pattern).              */
interface Blob {
  top: number;
  bottom: number;
  left: number;
  size: number;
  dir: -1 | 0 | 1;
}

const LEAD = "260ms var(--ease-out-soft)";
const TRAIL = "480ms cubic-bezier(0.34, 1.25, 0.64, 1) 50ms";
export function RadioGroup({
  options,
  value,
  defaultValue = "",
  onChange,
  name,
  className = "",
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const selected = value !== undefined ? value : internal;
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const groupRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(-1);
  const [blob, setBlob] = useState<Blob | null>(null);

  const select = (val: string, disabled?: boolean) => {
    if (disabled) return;
    setInternal(val);
    onChange?.(val);
  };

  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const tabStop = selectedIndex >= 0 ? selectedIndex : enabled[0];

  const measure = (dir: Blob["dir"]) => {
    const group = groupRef.current;
    const el = refs.current[prevIndex.current];
    if (!group || !el) return setBlob(null);
    setBlob({
      top: el.offsetTop,
      bottom: group.clientHeight - el.offsetTop - el.offsetHeight,
      left: el.offsetLeft,
      size: el.offsetWidth,
      dir,
    });
  };

  useLayoutEffect(() => {
    const prev = prevIndex.current;
    prevIndex.current = selectedIndex;
    measure(prev < 0 || selectedIndex < 0 ? 0 : selectedIndex > prev ? 1 : selectedIndex < prev ? -1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  // Rewrapped descriptions move the wells; follow them without animating.
  // An observer reports once on attach — that one is skipped, or it would
  // cut short a move already under way.
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    let attached = false;
    const ro = new ResizeObserver(() => {
      if (attached) measure(0);
      attached = true;
    });
    ro.observe(group);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = (from: number, step: 1 | -1) => {
    const at = enabled.indexOf(from);
    const next = enabled[(at + step + enabled.length) % enabled.length];
    refs.current[next]?.focus();
    select(options[next].value);
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={name}
      className={["relative flex flex-col gap-1", className].join(" ")}
    >
      {options.map((opt, i) => {
        const active = selected === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => select(opt.value, opt.disabled)}
            className={[
              "flex items-center justify-between gap-4 select-none py-1.5",
              opt.disabled ? "opacity-40 pointer-events-none" : "cursor-pointer group/radio",
            ].join(" ")}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span id={`${uid}-${i}-label`} className="text-[13px] font-medium text-ink leading-snug">
                {opt.label}
              </span>
              {opt.description && (
                <span id={`${uid}-${i}-desc`} className="text-[12px] text-ink-muted leading-relaxed">
                  {opt.description}
                </span>
              )}
            </div>

            {/* Clicks bubble to the row, so the control itself has no onClick */}
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              aria-labelledby={`${uid}-${i}-label`}
              aria-describedby={opt.description ? `${uid}-${i}-desc` : undefined}
              disabled={opt.disabled}
              tabIndex={i === tabStop ? 0 : -1}
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
                "shrink-0 w-[22px] h-[22px] rounded-full cursor-pointer",
                "transition-[box-shadow] duration-200 ease-out",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                active ? "" : "group-hover/radio:[box-shadow:var(--field-shadow-hover)]",
              ].join(" ")}
              style={{ background: "var(--field)", boxShadow: "var(--field-shadow)" }}
            />
          </div>
        );
      })}

      {blob && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              top: blob.top,
              bottom: blob.bottom,
              left: blob.left,
              width: blob.size,
              background: "var(--face-inverse)",
              boxShadow: "var(--face-inverse-shadow)",
              transition:
                blob.dir === 0
                  ? "none"
                  : blob.dir > 0
                    ? `top ${TRAIL}, bottom ${LEAD}`
                    : `top ${LEAD}, bottom ${TRAIL}`,
            }}
          />
          {/* The dot rides the trailing edge's spring, arriving as it settles */}
          <span
            aria-hidden
            className="pointer-events-none absolute w-2 h-2 rounded-full bg-ink-inverse"
            style={{
              top: blob.top + (blob.size - 8) / 2,
              left: blob.left + (blob.size - 8) / 2,
              boxShadow: "var(--dot-shadow)",
              transition: blob.dir === 0 ? "none" : `top ${TRAIL}`,
            }}
          />
        </>
      )}
    </div>
  );
}
