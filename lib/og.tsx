/* Drawing pieces for the generated icons and link-preview images.
   Satori (next/og) understands a subset of css, so everything here
   is flexbox, gradients and box-shadows: the same materials as the
   kit, written out longhand.                                       */
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function ogFonts() {
  const dir = path.join(process.cwd(), "app", "fonts", "ttf");
  const [medium, semibold] = await Promise.all([
    readFile(path.join(dir, "Archivo-Medium.ttf")),
    readFile(path.join(dir, "Archivo-SemiBold.ttf")),
  ]);
  return [
    { name: "Archivo", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Archivo", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

/* The mark: a dark keycap with a lowercase b, scaled to any size */
export function Keycap({ size, letter = "b" }: { size: number; letter?: string }) {
  const bezel = Math.max(1.5, size * 0.07);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        padding: bezel,
        borderRadius: size * 0.26,
        background: "linear-gradient(180deg, #3a3a3a 0%, #0c0c0c 100%)",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size * 0.2,
          background: "linear-gradient(180deg, #333333 0%, #1f1f1f 55%, #161616 100%)",
          boxShadow: `inset 0 ${Math.max(1, size * 0.04)}px ${Math.max(1, size * 0.05)}px -${Math.max(1, size * 0.03)}px rgba(255,255,255,0.22)`,
          color: "#ffffff",
          fontFamily: "Archivo",
          fontWeight: 600,
          fontSize: size * 0.56,
          letterSpacing: -size * 0.02,
          lineHeight: 1,
          paddingBottom: size * 0.06,
        }}
      >
        {letter}
      </div>
    </div>
  );
}

/* ── the dark room ─────────────────────────────────────────────────── */

/* One lamp over a dark room, and nothing else giving off light. Its
   cone ends on the card it's lighting, so no beam carries on past it;
   the only other glow is the lamp's own light scattering softly
   around the card.                                                */
export function LitScene({
  lampX,
  target,
  width = 1200,
  height = 630,
}: {
  lampX: number;
  /* The card the light lands on */
  target: { top: number; width: number };
  width?: number;
  height?: number;
}) {
  const shade = 132;
  const sh = shade * (30 / 64);
  const top = 26;
  const mouth = top + sh * (26 / 30);
  const half = shade * 0.42;
  // the cone meets the card just inside its top corners, under its body
  const land = target.top + 24;
  const landHalf = target.width * 0.44;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, display: "flex" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0" stopColor="#5a5a5a" />
            <stop offset="0.45" stopColor="#2e2e2e" />
            <stop offset="1" stopColor="#151515" />
          </linearGradient>
        </defs>
        <ellipse cx={lampX} cy={target.top + 60} rx={target.width * 0.95} ry={300} fill="url(#halo)" />
        <polygon points={`${lampX - half},${mouth} ${lampX + half},${mouth} ${lampX + landHalf},${land} ${lampX - landHalf},${land}`} fill="url(#cone)" />
        <ellipse cx={lampX} cy={mouth + 6} rx={half * 1.5} ry={22} fill="url(#glow)" />
        <rect x={lampX - 1} y={0} width={2} height={top + 2} fill="#3a3a3a" />
        <g transform={`translate(${lampX - shade / 2}, ${top}) scale(${shade / 64})`}>
          <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#1d1d1d" />
          <path d="M32 4 C 23 4, 17.5 7, 14.5 12.5 L 3 26 L 61 26 L 49.5 12.5 C 46.5 7, 41 4, 32 4 Z" fill="url(#shade)" />
          <path d="M30 5.2 C 23.5 5.6, 19 8, 16.2 12.6" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
          <ellipse cx="32" cy="26" rx="29" ry="2.6" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}

/* The pieces in the light: one card, built exactly like the kit's
   CardShell at 1.5x, with the real token values. A sunken field and a
   toggle on the face, the buttons on the rail beneath it.           */
const S = 1.5;
const px = (n: number) => n * S;
const ink = "#171717";

function SmallButton({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        padding: px(3),
        borderRadius: px(12),
        background: primary ? "linear-gradient(180deg, #2c2c2c 0%, #0c0c0c 100%)" : "linear-gradient(180deg, #f7f7f7 0%, #dedede 100%)",
        boxShadow: primary
          ? "0 0 0 0.5px rgba(0,0,0,0.33), 0 1px 1px rgba(0,0,0,0.2), 0 4px 12px -4px rgba(0,0,0,0.45)"
          : "0 0 0 0.5px rgba(17,17,17,0.054), 0 1px 1px rgba(17,17,17,0.06), 0 4px 10px -4px rgba(17,17,17,0.14)",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: `${px(8)}px ${px(16)}px`,
          borderRadius: px(9),
          background: primary
            ? "linear-gradient(180deg, #2e2e2e 0%, #1f1f1f 55%, #181818 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #fafafa 55%, #f3f3f3 100%)",
          boxShadow: primary
            ? "0 0 3px rgba(0,0,0,0.35), 0 1px 4px -1px rgba(0,0,0,0.3), inset 0 2px 3px -2px rgba(255,255,255,0.105)"
            : "0 0 3px rgba(17,17,17,0.119), 0 1px 4px -1px rgba(17,17,17,0.1), inset 0 2px 3px -2px #ffffff",
          color: primary ? "#ffffff" : "#262626",
          fontFamily: "Archivo",
          fontWeight: 500,
          fontSize: px(13),
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export const CARD = { width: px(300), height: 310 };

export function LitObjects({ x, y }: { x: number; y: number }) {
  const width = CARD.width;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y,
        width,
        display: "flex",
        flexDirection: "column",
        padding: `${px(6)}px ${px(6)}px 0`,
        borderRadius: px(24),
        background: "linear-gradient(180deg, #fdfdfd 0%, #f7f7f7 100%)",
        boxShadow:
          // the lit top rim, then the drop onto the floor below
          "inset 0 2px 0 rgba(255,255,255,1), 0 -1px 0 rgba(255,255,255,0.35), 0 0 0 0.5px rgba(17,17,17,0.036), 0 40px 70px -24px rgba(0,0,0,0.85), 0 18px 30px -16px rgba(0,0,0,0.5)",
        fontFamily: "Archivo",
      }}
    >
      {/* face */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: px(14),
          padding: px(16),
          borderRadius: px(18),
          background: "linear-gradient(180deg, #ffffff 0%, #fefefe 40%, #fafafa 100%)",
          boxShadow: "0 0 0 0.5px rgba(17,17,17,0.042), 0 1px 2px rgba(17,17,17,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: px(14), fontWeight: 600, color: ink, letterSpacing: -0.3 }}>new post</span>
          <span style={{ fontSize: px(11), color: "#a3a3a3" }}>draft</span>
        </div>
        {/* sunken field */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: px(40),
            padding: `0 ${px(14)}px`,
            borderRadius: px(12),
            background: "linear-gradient(180deg, #f2f2f2 0%, #f8f8f8 100%)",
            boxShadow: "inset 0 0 2px rgba(17,17,17,0.15), inset 0 1px 2px rgba(17,17,17,0.06), 0 1px 2px -1px rgba(255,255,255,0.72)",
            fontSize: px(13),
            color: ink,
          }}
        >
          the quiet art of long-form
          <div style={{ width: 2, height: px(16), marginLeft: 2, background: ink }} />
        </div>
        {/* toggle row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: px(2) }}>
            <span style={{ fontSize: px(12.5), fontWeight: 500, color: ink }}>email readers</span>
            <span style={{ fontSize: px(11), color: "#8a8a8a" }}>when it goes live</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: px(40),
              height: px(24),
              padding: px(2),
              borderRadius: px(12),
              background: "linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: px(20),
                height: px(20),
                borderRadius: px(10),
                background: "linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 #ffffff",
              }}
            />
          </div>
        </div>
      </div>
      {/* rail */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: px(8), padding: `${px(10)}px ${px(6)}px ${px(12)}px` }}>
        <SmallButton label="preview" />
        <SmallButton label="publish" primary />
      </div>
      {/* The lamp's light across the whole card: brightest at the top
          middle where the cone lands, falling off toward the lower edges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          borderRadius: px(24),
          // light falls off toward the sides, outside the cone's core
          background: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          borderRadius: px(24),
          // and with distance from the lamp, top to bottom
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.22) 100%)",
        }}
      />
    </div>
  );
}

/* The sunken command chip, in the dark room's own material */
export function CommandChip({ command }: { command: string }) {
  const fontSize = command.length > 30 ? 21 : command.length > 24 ? 23 : 26;
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        alignItems: "center",
        gap: 14,
        padding: "16px 24px",
        borderRadius: 18,
        background: "linear-gradient(180deg, #0a0a0a 0%, #151515 100%)",
        boxShadow: "inset 0 0 3px rgba(0,0,0,0.9), inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06)",
        fontFamily: "Archivo",
        fontSize,
        color: "#d4d4d4",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "#6b6b6b", flexShrink: 0 }}>$</span>
      {command}
    </div>
  );
}

export function Wordmark() {
  return (
    <div style={{ display: "flex", fontFamily: "Archivo", fontSize: 32, fontWeight: 600, letterSpacing: -1, color: "#f5f5f5" }}>
      blurrow<span style={{ color: "#6b6b6b", fontWeight: 500 }}>/ui</span>
    </div>
  );
}

export const roomBackground = "linear-gradient(180deg, #0c0c0c 0%, #101010 100%)";

/* Banners are drawn at 1200x630 and rendered at 2x, so text and edges
   stay sharp on high-density screens instead of being upscaled.     */
export const OG = { width: 1200, height: 630, scale: 2 };
export const ogSize = { width: OG.width * OG.scale, height: OG.height * OG.scale };
