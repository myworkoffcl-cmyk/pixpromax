"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function GoogleAd({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT!;
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ad blockers and privacy tools can prevent the Google script from loading.
      }
    }
  }, []);

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
