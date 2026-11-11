import { ImageResponse } from "next/og";
import { Mark, OgPage, ink, ogFonts, ogSize } from "@/lib/og";

export const alt =
  "The blurrow mark, a white key with a grey dish pressed into it, above the line: buttons you want to press, fields you want to fill in.";
export const size = ogSize;
export const contentType = "image/png";

/* The banner a shared link unfolds into: the mark resting on the
   landing page's grey, and the headline under it, split the way the
   hero splits it. Nothing else.                                    */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgPage>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Mark size={112} cast />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 60,
              fontSize: 62,
              fontWeight: 500,
              letterSpacing: -3.1,
              lineHeight: 1.04,
            }}
          >
            <span style={{ color: ink.base }}>buttons you want to press,</span>
            <span style={{ color: ink.faint }}>fields you want to fill in.</span>
          </div>
        </div>
      </OgPage>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
