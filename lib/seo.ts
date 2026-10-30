import type { Metadata } from "next";
import { author, siteName, siteUrl } from "./site";

/* Banners render at 2x (see lib/og), so that's the size declared here */

/* One page's metadata: canonical url, open graph and twitter cards. The
   preview image comes from the nearest opengraph-image route, which is
   named explicitly so a page's own openGraph never drops it.        */
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const full = `${title} · ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName,
      title: full,
      description,
      locale: "en_US",
      ...(image ? { images: [{ url: image, width: 2400, height: 1260, alt: full }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export const authorLd = { "@type": "Person", name: "manyports", url: author.site };

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${siteUrl}${t.path}` })),
  };
}
