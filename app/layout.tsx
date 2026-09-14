import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "../styles/pixel-studio.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Free Online Image Tools | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: SITE_NAME, title: `Free Online Image Tools | ${SITE_NAME}`, description: SITE_DESCRIPTION, images: [{ url: "/og.png", width: 1731, height: 909, alt: "PixProMax — Images in. Better images out." }] },
  twitter: { card: "summary_large_image", title: `Free Online Image Tools | ${SITE_NAME}`, description: SITE_DESCRIPTION, images: ["/og.png"] },
  category: "Image tools",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    ? { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pixpromax-theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`,
          }}
        />

        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
