import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "../styles/pixel-studio.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { Analytics } from "@/components/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { LocaleProvider } from "@/components/locale-provider";
import { LocaleNotification } from "@/components/locale-notification";
import { detectLocaleFromRequest } from "@/lib/locale";
import { getDir } from "@/config/locales";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Free Online Image Tools | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const optionalServicesEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" || Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const { locale, autoDetected } = await detectLocaleFromRequest();
  const dir = getDir(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('pixpromax-locale');if(l&&['en','es','zh-CN','hi','pt-BR','fr','ja','de','ar','bn','ko','it'].includes(l)){document.documentElement.lang=l;var d={ar:'rtl'};document.documentElement.dir=d[l]||'ltr'}}catch(e){}})();(function(){try{var t=localStorage.getItem('pixpromax-theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`,
          }}
        />

        <a className="skip-link" href="#main-content">Skip to main content</a>
        <LocaleProvider initialLocale={locale} initialAutoDetected={autoDetected}>
          <SiteHeader />
          <LocaleNotification />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </LocaleProvider>
        <ServiceWorkerRegister />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? <Script src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(process.env.NEXT_PUBLIC_ADSENSE_CLIENT)}`} strategy="lazyOnload" crossOrigin="anonymous" /> : null}
        <Analytics />
        <CookieConsent enabled={optionalServicesEnabled} />
      </body>
    </html>
  );
}
