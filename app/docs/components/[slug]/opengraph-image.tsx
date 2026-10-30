import { ImageResponse } from "next/og";
import { CARD, CommandChip, LitObjects, LitScene, OG, ogFonts, ogSize, roomBackground, Wordmark } from "@/lib/og";
import { getEntry } from "@/lib/registry";
import { pkg } from "@/lib/site";

const size = ogSize;

/* One image per component, with its own alt text */
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getEntry((await params).slug);
  return [
    {
      id: "banner",
      size,
      contentType: "image/png",
      alt: entry ? `${entry.name}, a blurrow/ui react component: ${entry.description}` : "a blurrow/ui component",
    },
  ];
}

/* Each component's banner: the same dark room, with its name and the one
   command that copies it in.                                        */
export default async function ComponentImage({ params }: { params: Promise<{ slug: string }>; id: Promise<string | number> }) {
  const entry = getEntry((await params).slug);
  const name = entry?.name ?? "component";
  // archivo has no ⌘ glyph; and cut long descriptions at a word, not mid-word
  const full = (entry?.description ?? "").replace(/⌘/g, "cmd+");
  const description = full.length > 100 ? full.slice(0, full.lastIndexOf(" ", 97)) + "…" : full;
  const nameSize = name.length > 14 ? 64 : name.length > 9 ? 80 : 100;

  return new ImageResponse(
    (
      <div style={{ width: ogSize.width, height: ogSize.height, display: "flex", background: roomBackground }}>
        <div
          style={{
            position: "relative",
            width: OG.width,
            height: OG.height,
            display: "flex",
            fontFamily: "Archivo",
            // satori scales around the centre, so shift by half the growth
            transform: `translate(${(OG.width * (OG.scale - 1)) / 2}px, ${(OG.height * (OG.scale - 1)) / 2}px) scale(${OG.scale})`,
          }}
        >
        <LitScene lampX={880} target={{ top: 190, width: CARD.width }} />
        <LitObjects x={880} y={190} />
        <div style={{ position: "relative", width: 580, height: "100%", display: "flex", flexDirection: "column", padding: "62px 0 62px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Wordmark />
            {entry && <div style={{ display: "flex", fontSize: 24, color: "#6b6b6b", marginTop: 4 }}>· {entry.category}</div>}
          </div>
          <div style={{ display: "flex", marginTop: 62, fontSize: nameSize, fontWeight: 500, letterSpacing: -nameSize * 0.045, lineHeight: 1, color: "#f5f5f5" }}>
            {name}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 27, lineHeight: 1.4, color: "#8a8a8a" }}>{description}</div>
          <div style={{ marginTop: "auto", display: "flex" }}>
            <CommandChip command={`npx ${pkg} add ${entry?.slug ?? ""}`} />
          </div>
        </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
