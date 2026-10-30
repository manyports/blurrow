import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "blurrow",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#EBEBEB",
    theme_color: "#EBEBEB",
    icons: [
      { src: "/icon/favicon", sizes: "32x32", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
