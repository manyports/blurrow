"use client";

import React, { useEffect, useRef, useState } from "react";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  className = "",
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const [displayed, setDisplayed] = useState(0);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    t.current = setTimeout(() => setDisplayed(pct), 80);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [pct]);

  return (
    <div className={["flex flex-col gap-2", className].join(" ")}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-4">
          {label && (
            <span className="text-[13px] font-medium text-ink-label truncate">{label}</span>
          )}
          {showValue && (
            <span aria-hidden className="text-[12px] tabular-nums text-ink-muted shrink-0">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-2 rounded-full p-px overflow-hidden"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
      >
        <div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            width: `${displayed}%`,
            /* Never collapses below a pill, so 1% still reads as started */
            minWidth: displayed > 0 ? 6 : 0,
            background: "var(--face-inverse)",
            boxShadow: "var(--fill-shadow)",
            transition: "width 700ms var(--ease-out-soft)",
          }}
        />
      </div>
    </div>
  );
}
