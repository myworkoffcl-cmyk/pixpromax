"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getOptionalServicesConsent } from "@/components/cookie-consent";

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [allowed, setAllowed] = useState(false);
  useEffect(() => { const update = () => setAllowed(getOptionalServicesConsent() === "granted"); update(); window.addEventListener("pixpromax-consent", update); return () => window.removeEventListener("pixpromax-consent", update); }, []);
  if (!measurementId || !allowed) return null;
  return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`} strategy="afterInteractive" /><Script id="pixpromax-ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${measurementId}');`}</Script></>;
}
