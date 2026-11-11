import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/ui/Toast";
import { SiteHeader } from "@/components/docs/SiteHeader";
import { getStars } from "@/lib/github";
import { themeScript } from "@/lib/theme";
import { author, homeTitle, siteDescription, siteName, siteUrl, socialDescription, socialTitle } from "@/lib/site";
import "./globals.css";

/* Only the three weights the site sets, as woff2: every face listed here
   is preloaded on every page, so an unused one only slows the first
   paint. (The .ttf copies are for the generated images in lib/og.)  */
const archivo = localFont({
  src: [
    { path: "./fonts/woff2/Archivo-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/woff2/Archivo-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/woff2/Archivo-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "manyports", url: author.site }],
  creator: "manyports",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    locale: "en_US",
    title: socialTitle,
    description: socialDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EBEBEB" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0C" },
  ],
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stars = await getStars();
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Sets data-theme before the first paint, so a dark page never flashes light */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-page font-sans text-ink">
        <ToastProvider>
          <SiteHeader stars={stars} />
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
