import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/ui/Toast";
import { SiteHeader } from "@/components/docs/SiteHeader";
import { getStars } from "@/lib/github";
import { author, homeTitle, siteDescription, siteName, siteUrl, socialDescription, socialTitle } from "@/lib/site";
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
        <Analytics />
      </body>
    </html>
  );
}
