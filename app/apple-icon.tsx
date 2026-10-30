import { ImageResponse } from "next/og";
import { Keycap, ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* iOS rounds the corners itself, so the keycap sits on the page's grey */
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#EBEBEB" }}>
        <Keycap size={132} />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
