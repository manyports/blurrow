import { ImageResponse } from "next/og";
import { Mark } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* iOS rounds the corners itself, so the mark rests on the page's grey */
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#EBEBEB" }}>
        <Mark size={124} cast />
      </div>
    ),
    size,
  );
}
