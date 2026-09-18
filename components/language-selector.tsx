"use client";

import { useLocale } from "@/lib/use-locale";
import { SUPPORTED_LOCALES } from "@/config/locales";
import type { Locale } from "@/types/locale";
import { useState, useRef, useEffect } from "react";
import styles from "./language-selector.module.css";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLocale = SUPPORTED_LOCALES[locale];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className={styles.flag}>🗣️</span>
        <span className={styles.label}>{currentLocale.nativeName}</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {Object.entries(SUPPORTED_LOCALES).map(([code, meta]) => (
            <button
              key={code}
              className={`${styles.item} ${locale === code ? styles.active : ""}`}
              onClick={() => {
                setLocale(code as Locale);
                setIsOpen(false);
              }}
            >
              <span className={styles.name}>{meta.nativeName}</span>
              <span className={styles.englishName}>({meta.name})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
