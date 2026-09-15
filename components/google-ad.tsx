"use client";

import { useEffect, useRef, useState } from "react";
import { getOptionalServicesConsent } from "@/components/cookie-consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function GoogleAd({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const initialized = useRef(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const update = () => setAllowed(getOptionalServicesConsent() === "granted");
    update();
    window.addEventListener("pixpromax-consent", update);
    return () => window.removeEventListener("pixpromax-consent", update);
  }, []);

  useEffect(() => {
    if (allowed && !initialized.current) {
      initialized.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ad blockers and privacy tools can prevent the Google script from loading.
      }
    }
  }, [allowed]);

  if (!client || !allowed) return null;

  return (
    <ins
      className="adsbygoogle"
      data-ad-client={client}
      data-ad-format="auto"
      data-ad-slot={slot}
      data-full-width-responsive="true"
    />
  );
}
