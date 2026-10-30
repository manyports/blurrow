"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { CardShell } from "./CardShell";

type StatTheme = "light" | "dark";
type DeltaDirection = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: { value: string; direction: DeltaDirection };
  hint?: string;
  sparkline?: number[];
  icon?: React.ReactNode;
  theme?: StatTheme;
  className?: string;
}

function useAnimatedNumber(target: number, duration: number) {
  const [v, setV] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const delta = target - from;
    if (delta === 0) return;
    // Reduced motion: show the number, skip the count
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevRef.current = target;
      const id = requestAnimationFrame(() => setV(target));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(from + delta * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return v;
}

function Sparkline({ data, dark }: { data: number[]; dark?: boolean }) {
  const uid = useId();
  if (data.length < 2) return null;
  const W = 120;
  const H = 44;
  const P = 6;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = (W - P * 2) / (data.length - 1);

  const pts = data.map((d, i) => {
    const x = P + i * step;
    const y = H - P - ((d - min) / range) * (H - P * 2);
    return [x, y] as const;
  });

  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  // The fill runs off both edges of the face so it reads as part of the surface
  const area = `M0,${pts[0][1].toFixed(1)} ${line.replace(/^M/, "L")} L${W},${pts[pts.length - 1][1].toFixed(1)} L${W},${H} L0,${H} Z`;

  const stroke = dark ? "#ffffff" : "#171717";
  const gradId = `spark-fade-${uid.replace(/:/g, "")}`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <div
      aria-hidden
      className="relative h-14"
      // Fades in from the left so the line arrives rather than starts at a hard edge
      style={{
        maskImage: "linear-gradient(90deg, transparent 0%, #000 18%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 18%)",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={dark ? 0.2 : 0.08} />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeOpacity={dark ? 0.85 : 0.9}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The latest value, as a dot — drawn in HTML so it stays round when the SVG stretches */}
      <span
        className="absolute w-[7px] h-[7px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(lx / W) * 100}%`,
          top: `${(ly / H) * 100}%`,
          background: stroke,
          boxShadow: dark ? "0 0 0 3px rgba(255,255,255,0.14)" : "0 0 0 3px rgba(17,17,17,0.08)",
        }}
      />
    </div>
  );
}

const deltaTone: Record<DeltaDirection, { light: string; dark: string; label: string }> = {
  up: { light: "text-emerald-700", dark: "text-emerald-400", label: "up" },
  down: { light: "text-red-600", dark: "text-red-400", label: "down" },
  neutral: { light: "text-neutral-600", dark: "text-neutral-300", label: "unchanged" },
};

function DeltaArrow({ direction }: { direction: DeltaDirection }) {
  const d =
    direction === "up" ? "M12 19V5m0 0l-6 6m6-6l6 6" : direction === "down" ? "M12 5v14m0 0l-6-6m6 6l6-6" : "M5 12h14m0 0l-6-6m6 6l-6 6";
  return (
    <svg aria-hidden width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* Built on CardShell; the trend line bleeds off the bottom of the face
   like a chart on a screen.                                            */
export function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delta,
  hint,
  sparkline,
  icon,
  theme = "light",
  className = "",
}: StatCardProps) {
  const animated = useAnimatedNumber(value, 900);
  const dark = theme === "dark";

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const finalText = `${prefix}${formatter.format(value)}${suffix}`;

  const badge = delta && (
    <span
      aria-label={`${deltaTone[delta.direction].label} ${delta.value}`}
      className={[
        "inline-flex items-center gap-1 h-6 px-2 rounded-[7px] text-[12px] font-medium tabular-nums shrink-0",
        dark ? deltaTone[delta.direction].dark : deltaTone[delta.direction].light,
      ].join(" ")}
      style={{
        background: dark ? "var(--tile-dark)" : "var(--face-light)",
        boxShadow: dark ? "var(--tile-dark-shadow)" : "var(--tile-light-shadow)",
      }}
    >
      <DeltaArrow direction={delta.direction} />
      {delta.value}
    </span>
  );

  /* Label and change share the top line — what it is, and which way it's
     going. The number carries the card; the hint qualifies it in a
     quieter voice right underneath.                                     */
  return (
    <CardShell theme={theme} className={className}>
      <div className="px-6 pt-5 flex items-center justify-between gap-3 min-h-11">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div
              aria-hidden
              className={[
                "w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0",
                dark ? "text-neutral-100" : "text-neutral-600",
              ].join(" ")}
              style={{
                background: dark ? "var(--tile-dark)" : "var(--face-light)",
                boxShadow: dark ? "var(--tile-dark-shadow)" : "var(--tile-light-shadow)",
              }}
            >
              {icon}
            </div>
          )}
          <p
            className={[
              "text-[14px] font-medium tracking-[-0.01em] truncate",
              dark ? "text-neutral-300" : "text-neutral-700",
            ].join(" ")}
          >
            {label}
          </p>
        </div>
        {badge}
      </div>

      {/* Screen readers get the final value once, not every frame of the count */}
      <p className="sr-only">{finalText}</p>
      <p
        aria-hidden
        className={[
          "px-6 mt-5 text-[44px] font-semibold tabular-nums tracking-[-0.045em] leading-none",
          dark ? "text-white" : "text-neutral-900",
        ].join(" ")}
      >
        {prefix}
        {formatter.format(animated)}
        {/* Units are context, not the headline — set them smaller and quieter */}
        {suffix && (
          <span
            className={[
              "ml-1 text-[17px] font-medium tracking-[-0.01em]",
              dark ? "text-neutral-500" : "text-neutral-400",
            ].join(" ")}
          >
            {suffix.trim()}
          </span>
        )}
      </p>
      {hint && (
        <p className={["px-6 mt-2.5 text-[13px] truncate", dark ? "text-neutral-500" : "text-neutral-500"].join(" ")}>
          {hint}
        </p>
      )}

      {/* The trend line bleeds to the face's edges, like a chart on a screen */}
      {sparkline && sparkline.length > 1 ? (
        <div className="mt-auto pt-6">
          <Sparkline data={sparkline} dark={dark} />
        </div>
      ) : (
        <div className="pb-6" />
      )}
    </CardShell>
  );
}
