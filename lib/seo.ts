import type { Metadata } from "next";
import { author, siteName, siteUrl } from "./site";

/* Banners render at 2x (see lib/og), so that's the size declared here */
const IMAGE = { width: 2400, height: 1260 };

/* One page's metadata, following google's guidance: a descriptive title
   (the layout adds " | blurrow"), a description that summarises this
   page and no other, and a link preview that uses the plain title
   without the brand. The preview image is named explicitly so a page's
   own openGraph never drops it.                                      */
export function pageMetadata({
  title,
  description,
  path,
  socialTitle = title,
  image = "/opengraph-image",
  imageAlt,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  image?: string;
  imageAlt: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName,
      title: socialTitle,
      description,
      locale: "en_US",
      images: [{ url: image, ...IMAGE, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

/* The site's copy is lowercase by design; search results and link
   previews are read out of that context, so they get sentence case and
   proper names their capitals.                                     */
const PROPER: [RegExp, string][] = [
  [/\breact\b/gi, "React"],
  [/\btailwind css\b/gi, "Tailwind CSS"],
  [/\btailwind\b/gi, "Tailwind"],
  [/\barchivo\b/gi, "Archivo"],
  [/\bgithub\b/gi, "GitHub"],
  [/⌘k/g, "⌘K"],
];
export function sentenceCase(text: string) {
  let out = text.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead: string, ch: string) => lead + ch.toUpperCase());
  for (const [re, word] of PROPER) out = out.replace(re, word);
  return out;
}

export const authorLd = { "@type": "Person", name: "manyports", url: author.site };

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${siteUrl}${t.path}` })),
  };
}
