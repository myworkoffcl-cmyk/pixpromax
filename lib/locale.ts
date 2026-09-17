import type { Locale } from "@/config/locales";
import { DEFAULT_LOCALE, isValidLocale, SUPPORTED_LOCALES } from "@/config/locales";
import { headers } from "next/headers";

export interface LocaleDetectionResult {
  locale: Locale;
  autoDetected: boolean;
}

export function parseAcceptLanguage(header: string): Locale[] {
  if (!header) return [];

  return header
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";")[0].split("-");
      const base = parts[0].toLowerCase();
      const region = parts[1]?.toUpperCase();

      if (base === "zh" && region === "CN") return "zh-CN";
      if (base === "pt" && region === "BR") return "pt-BR";
      if (base && isValidLocale(base as Locale)) return base as Locale;

      return null;
    })
    .filter((l): l is Locale => l !== null);
}

export async function detectLocaleFromRequest(): Promise<LocaleDetectionResult> {
  const headersList = await headers();

  // Check cookie first (explicit user selection)
  const cookieHeader = headersList.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/pixpromax-locale=([^;]+)/);
  if (cookieMatch) {
    const locale = cookieMatch[1].trim();
    if (isValidLocale(locale)) {
      return { locale: locale as Locale, autoDetected: false };
    }
  }

  // Fall back to Accept-Language header
  const acceptLanguage = headersList.get("accept-language") || "";
  const preferredLocales = parseAcceptLanguage(acceptLanguage);

  if (preferredLocales.length > 0) {
    return { locale: preferredLocales[0], autoDetected: true };
  }

  // Default to English
  return { locale: DEFAULT_LOCALE, autoDetected: false };
}

export function formatLocaleDisplay(locale: Locale): string {
  return SUPPORTED_LOCALES[locale]?.nativeName || locale;
}
