"use client";

import { useSyncExternalStore } from "react";

const CONSENT_KEY = "pixpromax-optional-services";
export type OptionalServicesConsent = "granted" | "denied" | null;

export function getOptionalServicesConsent(): OptionalServicesConsent {
  try { const value = localStorage.getItem(CONSENT_KEY); return value === "granted" || value === "denied" ? value : null; } catch { return null; }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("pixpromax-consent", onStoreChange);
  return () => window.removeEventListener("pixpromax-consent", onStoreChange);
}

export function CookieConsent({ enabled }: { enabled: boolean }) {
  const choice = useSyncExternalStore(subscribe, getOptionalServicesConsent, () => null);
  if (!enabled || choice) return null;
  const save = (value: Exclude<OptionalServicesConsent, null>) => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Optional services stay unavailable if storage is blocked. */ }
    window.dispatchEvent(new Event("pixpromax-consent"));
  };
  return <section className="cookie-consent" aria-label="Optional services preference"><p><strong>Optional cookies and measurement</strong><span>PixProMax can use optional advertising or analytics only if you allow it. Core image tools work either way.</span></p><div><button className="button secondary" type="button" onClick={() => save("denied")}>Only essential</button><button className="button primary" type="button" onClick={() => save("granted")}>Allow optional services</button></div></section>;
}
