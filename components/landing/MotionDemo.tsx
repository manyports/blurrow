"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs } from "@/components/ui/Tabs";

const periods = [
  { key: "day", label: "day", total: 1284, bars: [12, 18, 9, 24, 30, 44, 52, 61, 48, 40, 33, 27] },
  { key: "week", label: "week", total: 9416, bars: [40, 46, 38, 55, 62, 58, 70, 66, 74, 69, 80, 77] },
  { key: "month", label: "month", total: 38902, bars: [30, 36, 44, 41, 52, 60, 57, 64, 72, 79, 85, 92] },
  { key: "year", label: "year", total: 412870, bars: [22, 28, 35, 33, 46, 52, 63, 59, 71, 84, 90, 98] },
];

/* Counts from the old number to the new one instead of swapping it */
function useTweened(value: number, ms = 700) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    // With reduced motion it lands on the first frame
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
    const start = from.current;
    let raf = 0;
    let t0 = -1;
    const tick = (now: number) => {
      if (t0 < 0) t0 = now;
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const eased = 1 - (1 - t) ** 3;
      const v = Math.round(start + (value - start) * eased);
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

/* The kit's own Tabs driving a chart: the thumb slides to the period,
   each bar grows to its new height a beat after its neighbour, and the
   total counts its way over.                                         */
export function MotionDemo() {
  const [key, setKey] = useState("week");
  const period = periods.find((p) => p.key === key)!;
  const total = useTweened(period.total);

  return (
    <div
      className="rounded-[22px] p-5 sm:p-7 flex flex-col gap-6"
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--panel-shadow)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs defaultTab="week" onChange={setKey} tabs={periods.map((p) => ({ key: p.key, label: p.label }))} />
        <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
          <p className="text-[28px] font-medium tracking-[-0.03em] text-neutral-900 tabular-nums">{total.toLocaleString("en-US")}</p>
          <p className="text-[12.5px] text-neutral-500">readers this {period.label}</p>
        </div>
      </div>
      <div
        className="h-44 rounded-[16px] px-3 pt-4 pb-3 flex items-end gap-1.5 sm:gap-2"
        style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
      >
        {period.bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-[7px]"
            style={{
              height: `${h}%`,
              background: "var(--face-light)",
              boxShadow: "var(--thumb-shadow)",
              transition: `height 700ms var(--ease-spring) ${i * 30}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
