"use client";

import { useLocale } from "@/lib/use-locale";
import { useEffect, useState } from "react";
import { loadTranslations } from "@/lib/translations";
import type { TranslationNamespaceKey } from "@/lib/translations";
import type { TranslationNamespace } from "@/types/locale";

export function useTranslation(namespace: TranslationNamespaceKey) {
  const { locale } = useLocale();
  const [translations, setTranslations] = useState<TranslationNamespace>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadTranslations(locale, namespace).then((trans) => {
      setTranslations(trans);
      setLoading(false);
    });
  }, [locale, namespace]);

  const t = (key: string, fallback: string = key): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }

    return typeof value === "string" ? value : fallback;
  };

  return { t, loading };
}
