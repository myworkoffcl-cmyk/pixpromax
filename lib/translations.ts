import type { Locale, TranslationNamespace as TranslationNS } from "@/types/locale";

export type TranslationNamespaceKey =
  | "common"
  | "home"
  | "tools"
  | "workspace"
  | "messages"
  | "faq"
  | "metadata"
  | "policy";

type TranslationCache = Record<string, Partial<Record<TranslationNamespaceKey, TranslationNS>>>;

const translationCache: TranslationCache = {};

export async function loadTranslations(
  locale: Locale,
  namespace: TranslationNamespaceKey
): Promise<TranslationNS> {
  // Check cache
  if (translationCache[locale]?.[namespace]) {
    return translationCache[locale][namespace];
  }

  try {
    // Dynamically import translation file
    const module = await import(
      `@/locales/${locale}/${namespace}.json`
    );

    // Handle both .default and direct export
    const translations = module.default || module;

    // Cache the translations
    if (!translationCache[locale]) {
      translationCache[locale] = {};
    }
    translationCache[locale][namespace] = translations;

    return translations;
  } catch (error) {
    console.error(
      `Failed to load translations for locale=${locale}, namespace=${namespace}`,
      error
    );
    // Fall back to English
    if (locale !== "en") {
      return loadTranslations("en", namespace);
    }
    // Return empty object as last resort
    return {};
  }
}

export function getNestedValue(
  obj: any,
  path: string,
  fallback: string = path
): string {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }

  return typeof value === "string" ? value : fallback;
}

export function clearTranslationCache(): void {
  Object.keys(translationCache).forEach((key) => {
    delete translationCache[key];
  });
}
