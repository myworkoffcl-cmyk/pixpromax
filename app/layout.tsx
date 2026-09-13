import type { Metadata, Viewport } from "next";
import { DM_Sans, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../styles/pixel-studio.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const display = Sora({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

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

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f5f7f2" }, { media: "(prefers-color-scheme: dark)", color: "#111714" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? (
          <Script
            id="pixpromax-adsense-review"
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            strategy="beforeInteractive"
          />
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('pixpromax-theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()` }} />
        <SiteHeader /><main>{children}</main><SiteFooter /><ServiceWorkerRegister />
      </body>
    </html>
  );
}
