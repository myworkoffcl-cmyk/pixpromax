import type { Locale, LocaleMetadata } from "@/types/locale";

export type { Locale, LocaleMetadata };

export const SUPPORTED_LOCALES: Record<Locale, LocaleMetadata> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
  },
  "zh-CN": {
    code: "zh-CN",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    dir: "ltr",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    dir: "ltr",
  },
  "pt-BR": {
    code: "pt-BR",
    name: "Portuguese",
    nativeName: "Português",
    dir: "ltr",
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    dir: "ltr",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    dir: "ltr",
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    dir: "ltr",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
  },
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    dir: "ltr",
  },
  ko: {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    dir: "ltr",
  },
  it: {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    dir: "ltr",
  },
};

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "pixpromax-locale";
export const LOCALE_STORAGE_KEY = "pixpromax-locale";
export const COOKIE_MAX_AGE = 31536000; // 1 year

export function isValidLocale(value: any): value is Locale {
  return value in SUPPORTED_LOCALES;
}

export function getLocaleMetadata(locale: Locale): LocaleMetadata {
  return SUPPORTED_LOCALES[locale];
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return SUPPORTED_LOCALES[locale]?.dir || "ltr";
}
