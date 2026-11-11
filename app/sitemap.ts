import type { MetadataRoute } from "next";
import { lastModified, pageSources } from "@/lib/lastmod";
import { registry } from "@/lib/registry";
import { siteUrl } from "@/lib/site";

/* Every page, with the date its content last changed. No changefreq or
   priority: google ignores both, and lastmod only counts while it's
   true, so each date comes from git, not the time of the build.     */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, date: Date | undefined) => ({
    url: `${siteUrl}${path}`,
    ...(date ? { lastModified: date } : {}),
  });
  return [
    page("", lastModified(pageSources.home)),
    page("/docs", lastModified(pageSources.docs)),
    page("/docs/installation", lastModified(pageSources.installation)),
    page("/docs/components", lastModified(pageSources.components)),
    ...registry.map((e) => page(`/docs/components/${e.slug}`, lastModified(pageSources.component(e)))),
    page("/privacy", lastModified(pageSources.privacy)),
  ];
}
