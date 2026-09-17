"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale, LocaleContext as LocaleContextType } from "@/types/locale";
import { getDir, isValidLocale, LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY, COOKIE_MAX_AGE } from "@/config/locales";
import { LocaleContext } from "@/lib/use-locale";

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  initialAutoDetected: boolean;
}

export function LocaleProvider({
  children,
  initialLocale,
  initialAutoDetected,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isClient, setIsClient] = useState(false);

  // Hydration-safe: only run on client
  useEffect(() => {
    setIsClient(true);

    // Check localStorage for user preference
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored && isValidLocale(stored)) {
        setLocaleState(stored as Locale);
        // Update HTML attributes
        document.documentElement.lang = stored;
        document.documentElement.dir = getDir(stored as Locale);
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);

    // Persist to localStorage
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (e) {
      // localStorage not available
    }

    // Persist to cookie
    const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString();
    document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; Path=/; Expires=${expires}; SameSite=Lax`;

    // Update HTML attributes
    document.documentElement.lang = newLocale;
    document.documentElement.dir = getDir(newLocale);
  }, []);

  const value: LocaleContextType = useMemo(
    () => ({
      locale,
      dir: getDir(locale),
      autoDetected: initialAutoDetected && !isClient,
      setLocale,
    }),
    [locale, setLocale, initialAutoDetected, isClient]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}
