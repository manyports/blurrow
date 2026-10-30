import { ImageResponse } from "next/og";
import { CARD, CommandChip, LitObjects, LitScene, OG, ogFonts, ogSize, roomBackground, Wordmark } from "@/lib/og";
import { initCommand } from "@/lib/site";

export const alt =
  "A pendant lamp in a dark room lighting a blurrow card with a text field, a toggle and two buttons, beside the line: buttons you want to press, fields you want to fill in.";
export const size = ogSize;
export const contentType = "image/png";

/* The banner a shared link unfolds into: the end of the landing page's
   dark room, with the lamp lighting a few of the kit's pieces.      */
export default async function OpengraphImage() {
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
        <LitScene lampX={860} target={{ top: 190, width: CARD.width }} />
        <LitObjects x={860} y={190} />
        <div style={{ position: "relative", width: 560, height: "100%", display: "flex", flexDirection: "column", padding: "62px 0 62px 72px" }}>
          <Wordmark />
          <div style={{ display: "flex", flexDirection: "column", marginTop: 64, fontSize: 64, fontWeight: 500, letterSpacing: -2.6, lineHeight: 1.04 }}>
            <span style={{ color: "#f5f5f5" }}>buttons you want</span>
            <span style={{ color: "#f5f5f5" }}>to press,</span>
            <span style={{ color: "#6b6b6b" }}>fields you want</span>
            <span style={{ color: "#6b6b6b" }}>to fill in.</span>
          </div>
          <div style={{ marginTop: "auto", display: "flex" }}>
            <CommandChip command={initCommand} />
          </div>
        </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
