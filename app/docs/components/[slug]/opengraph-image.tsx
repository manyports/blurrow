import { ImageResponse } from "next/og";
import { Mark, OgPage, ink, ogFonts, ogSize } from "@/lib/og";
import { getEntry } from "@/lib/registry";

const size = ogSize;

/* One image per component, with its own alt text */
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getEntry((await params).slug);
  return [
    {
      id: "banner",
      size,
      contentType: "image/png",
      alt: entry ? `The blurrow ${entry.name} component: ${entry.description}` : "Banner for a blurrow component",
    },
  ];
}

/* Each component's banner: the same grey page, the mark and where it
   lives up top, and the component's name set large at the bottom, the
   way the landing page sets its titles.                           */
export default async function ComponentImage({ params }: { params: Promise<{ slug: string }>; id: Promise<string | number> }) {
  const entry = getEntry((await params).slug);
  const name = entry?.name ?? "component";
  // archivo has no ⌘ glyph. Keep it to the first sentence when that's
  // enough to stand alone; otherwise cut at a word, not mid-word
  const full = (entry?.description ?? "").replace(/⌘/g, "cmd+");
  const first = full.match(/^.+?\.(?=\s|$)/)?.[0] ?? full;
  const short = first.length >= 24 && first.length <= 96 ? first : full;
  const description = short.length > 96 ? short.slice(0, short.lastIndexOf(" ", 93)) + "…" : short;
  const nameSize = name.length > 16 ? 104 : name.length > 11 ? 124 : 148;

  return new ImageResponse(
    (
      <OgPage>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "64px 80px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mark size={48} cast />
            <div style={{ display: "flex", fontSize: 28, fontWeight: 600, letterSpacing: -0.9 }}>
              <span style={{ color: ink.base }}>blurrow</span>
              {entry && <span style={{ color: ink.faint, fontWeight: 500, marginLeft: 12 }}>/ {entry.category}</span>}
            </div>
          </div>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: nameSize, fontWeight: 500, letterSpacing: -nameSize * 0.05, lineHeight: 0.95, color: ink.base }}>
              {name}
            </div>
            {description && (
              <div style={{ display: "flex", marginTop: 28, maxWidth: 860, fontSize: 30, lineHeight: 1.35, letterSpacing: -0.3, color: ink.muted }}>
                {description}
              </div>
            )}
          </div>
        </div>
      </OgPage>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
