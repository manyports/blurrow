import { ImageResponse } from "next/og";
import { Keycap, ogFonts } from "@/lib/og";

/* The mark at two sizes: a crisp favicon, and a large one for the web
   manifest and anywhere else that wants a big icon.                */
export function generateImageMetadata() {
  return [
    { id: "favicon", contentType: "image/png", size: { width: 32, height: 32 } },
    { id: "512", contentType: "image/png", size: { width: 512, height: 512 } },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = (await id) === "favicon" ? 32 : 512;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        <Keycap size={size} />
      </div>
    ),
    { width: size, height: size, fonts: await ogFonts() },
  );
}
