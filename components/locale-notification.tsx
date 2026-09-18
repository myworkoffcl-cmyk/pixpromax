"use client";

import { useLocale } from "@/lib/use-locale";
import { SUPPORTED_LOCALES } from "@/config/locales";
import { useState, useEffect } from "react";
import styles from "./locale-notification.module.css";

export function LocaleNotification() {
  const { locale, autoDetected, setLocale } = useLocale();
  const [isDismissed, setIsDismissed] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (autoDetected) {
      setIsDismissed(false);
      const timer = setTimeout(() => setIsDismissed(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [autoDetected]);

  const handleChangeToEnglish = () => {
    setLocale('en');
    setIsDismissed(true);
  };

  if (isDismissed || !isClient || !autoDetected) {
    return null;
  }

  const localeName = SUPPORTED_LOCALES[locale]?.nativeName || locale;
  const isEnglish = locale === 'en';

  return (
    <div className={styles.notification}>
      <p className={styles.text}>
        {isEnglish ? (
          <>Language auto-detected: <strong>{localeName}</strong></>
        ) : (
          <>
            Viewing in <strong>{localeName}</strong> •
            <button className={styles.changeButton} onClick={handleChangeToEnglish}>
              Change to English
            </button>
          </>
        )}
      </p>
      <button
        className={styles.closeButton}
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
