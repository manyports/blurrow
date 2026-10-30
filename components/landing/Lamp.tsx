"use client";

import { useId } from "react";

/* A small metal pendant shade: a cap, a low wide dome shaded from its lit
   side to its far side, and the mouth the light comes out of. When
   it's on, the inside of the mouth glows and light spills below it.  */
export function Lamp({ lit, width = 56, strong = false }: { lit: boolean; width?: number; strong?: boolean }) {
  // useId can contain characters url(#…) won't accept
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const height = Math.round(width * (30 / 64));
  const mouthY = (26 / 30) * height;

  return (
    <span aria-hidden className="relative block" style={{ width, height }}>
      <svg width={width} height={height} viewBox="0 0 64 30" className="block overflow-visible">
        <defs>
          <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0" stopColor="#4a4a4a" />
            <stop offset="0.45" stopColor="#2a2a2a" />
            <stop offset="1" stopColor="#111111" />
          </linearGradient>
          <radialGradient id={`${id}-mouth`} cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e6e6e6" />
          </radialGradient>
        </defs>
        {/* cap */}
        <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#1d1d1d" />
        {/* shade */}
        <path
          d="M32 4 C 23 4, 17.5 7, 14.5 12.5 L 3 26 L 61 26 L 49.5 12.5 C 46.5 7, 41 4, 32 4 Z"
          fill={`url(#${id}-shade)`}
        />
        {/* light catching the edge nearest the room's light */}
        <path d="M30 5.2 C 23.5 5.6, 19 8, 16.2 12.6" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* mouth */}
        <ellipse
          cx="32"
          cy="26"
          rx="29"
          ry="2.6"
          fill={lit ? `url(#${id}-mouth)` : "#262626"}
          style={{ transition: "fill 300ms ease" }}
        />
      </svg>
      {/* spill of light below the mouth */}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: mouthY - 1,
          width: width * 0.72,
          height: 2,
          background: lit ? "#fff" : "transparent",
          boxShadow: lit
            ? strong
              ? "0 6px 40px 14px rgba(255,255,255,0.95), 0 20px 120px 40px rgba(255,255,255,0.6)"
              : "0 4px 18px 6px rgba(255,255,255,0.95)"
            : "none",
          transition: "box-shadow 600ms ease, background-color 300ms ease",
        }}
      />
    </span>
  );
}
