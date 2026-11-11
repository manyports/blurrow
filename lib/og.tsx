/* Drawing pieces for the generated icons and link-preview images.
   Satori (next/og) understands a subset of css, so everything here
   is flexbox, gradients and box-shadows: the same materials as the
   kit, written out longhand.

   The banners follow the landing page, not a poster: the page's own
   grey, lit from above, one object on it and as few words as will
   do. A link preview is seen at ~400px wide, so whatever is on it
   has to survive being that small.                                 */
import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function ogFonts() {
  const dir = path.join(process.cwd(), "app", "fonts", "ttf");
  const [regular, medium, semibold] = await Promise.all([
    readFile(path.join(dir, "Archivo-Regular.ttf")),
    readFile(path.join(dir, "Archivo-Medium.ttf")),
    readFile(path.join(dir, "Archivo-SemiBold.ttf")),
  ]);
  return [
    { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Archivo", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

/* The kit's ink, from styles.css (oklch values written out as hex) */
export const ink = {
  strong: "#0a0a0a",
  base: "#171717",
  body: "#525252",
  muted: "#737373",
  faint: "#a1a1a1",
};

/* The mark: a white key with a grey dish pressed into it, lit like
   everything else in the kit: the light from above shades the dish's
   top wall and falls on its floor, and its lower lip catches a line of
   white. At favicon sizes the bezel and dish go a few steps darker so
   the shape still reads on a white browser tab. With `cast`, it rests
   on the page and throws a shadow under the one light.             */
export function Mark({ size, cast = false }: { size: number; cast?: boolean }) {
  const s = size;
  const small = s <= 48;
  const bezel = Math.max(1, s * 0.06);
  const dish = s * 0.42;
  const hair = Math.max(0.5, s * 0.008);
  return (
    <div
      style={{
        width: s,
        height: s,
        display: "flex",
        padding: bezel,
        borderRadius: s * 0.26,
        background: small ? "linear-gradient(180deg, #ececec 0%, #a9a9a9 100%)" : "linear-gradient(180deg, #f7f7f7 0%, #d6d6d6 100%)",
        // Cast: a shadow onto the page. Uncast (the icons, which fill their
        // canvas): a hairline drawn inside the edge, so it isn't clipped,
        // and the pale bezel still has an edge on a white background
        boxShadow: cast
          ? `0 0 0 0.5px rgba(0,0,0,0.12), 0 ${s * 0.01}px ${s * 0.02}px rgba(0,0,0,0.12), 0 ${s * 0.12}px ${s * 0.24}px -${s * 0.08}px rgba(0,0,0,0.3), 0 ${s * 0.3}px ${s * 0.5}px -${s * 0.2}px rgba(0,0,0,0.18)`
          : `inset 0 0 0 ${Math.max(0.5, s * 0.004)}px rgba(0,0,0,0.12)`,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: s * 0.2,
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 55%, #f0f0f0 100%)",
          boxShadow: `0 0 ${s * 0.02}px rgba(0,0,0,0.15), inset 0 ${Math.max(1, s * 0.04)}px ${Math.max(1, s * 0.05)}px -${Math.max(1, s * 0.03)}px #ffffff`,
        }}
      >
        <div
          style={{
            width: dish,
            height: dish,
            borderRadius: dish,
            background: small ? "linear-gradient(180deg, #9a9a9a 0%, #c8c8c8 100%)" : "linear-gradient(180deg, #b4b4b4 0%, #d8d8d8 100%)",
            boxShadow: `inset 0 ${s * 0.025}px ${s * 0.035}px rgba(0,0,0,0.32), inset 0 0 ${hair}px rgba(0,0,0,0.25), 0 ${hair}px 0 #ffffff`,
          }}
        />
      </div>
    </div>
  );
}

/* Banners are drawn at 1200x630 and rendered at 2x, so text and edges
   stay sharp on high-density screens instead of being upscaled.     */
export const OG = { width: 1200, height: 630, scale: 2 };
export const ogSize = { width: OG.width * OG.scale, height: OG.height * OG.scale };

/* The landing page's grey, with the light coming from above it: a soft
   pool near the top edge, the floor a touch darker toward the bottom. */
export function OgPage({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: ogSize.width, height: ogSize.height, display: "flex", background: "#ebebeb" }}>
      <div
        style={{
          position: "relative",
          width: OG.width,
          height: OG.height,
          display: "flex",
          fontFamily: "Archivo",
          color: ink.base,
          background:
            "radial-gradient(60% 75% at 50% 0%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%), linear-gradient(180deg, rgba(17,17,17,0) 55%, rgba(17,17,17,0.035) 100%)",
          // satori scales around the centre, so shift by half the growth
          transform: `translate(${(OG.width * (OG.scale - 1)) / 2}px, ${(OG.height * (OG.scale - 1)) / 2}px) scale(${OG.scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
