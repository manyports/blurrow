import type { MetadataRoute } from "next";
import { registry } from "@/lib/registry";
import { siteUrl } from "@/lib/site";

/* Every page, with the landing page and the docs' front pages first */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/docs", 0.9),
    page("/docs/installation", 0.9),
    page("/docs/components", 0.9, "weekly"),
    ...registry.map((e) => page(`/docs/components/${e.slug}`, 0.7)),
  ];
}
