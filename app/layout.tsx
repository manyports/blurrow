import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/Toast";
import { SiteHeader } from "@/components/docs/SiteHeader";
import { getStars } from "@/lib/github";
import { author, keywords, siteDescription, siteName, siteUrl, tagline } from "@/lib/site";
import "./globals.css";

const archivo = localFont({
  src: [
    { path: "./fonts/ttf/Archivo-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/ttf/Archivo-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/ttf/Archivo-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/ttf/Archivo-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/ttf/Archivo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/ttf/Archivo-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./fonts/ttf/Archivo-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/ttf/Archivo-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} · tactile react components for tailwind css`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords,
  authors: [{ name: "manyports", url: author.site }],
  creator: "manyports",
  publisher: "manyports",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    locale: "en_US",
    title: `${siteName} · ${tagline}`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} · ${tagline}`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#EBEBEB",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stars = await getStars();
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#EBEBEB] font-sans text-neutral-900">
        <ToastProvider>
          <SiteHeader stars={stars} />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
