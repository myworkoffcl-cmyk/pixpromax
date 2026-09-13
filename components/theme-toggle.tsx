"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { isThemePreference, nextThemePreference, type ThemePreference } from "@/utils/theme";

function applyTheme(theme: ThemePreference) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
}

function storedTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const value = localStorage.getItem("pixpromax-theme");
    return isThemePreference(value) ? value : "system";
  } catch {
    return "system";
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(storedTheme);

  useEffect(() => {
    applyTheme(theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => theme === "system" && applyTheme("system");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);

  const toggle = () => {
    const next = nextThemePreference(theme);
    setTheme(next);
    try {
      localStorage.setItem("pixpromax-theme", next);
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
    applyTheme(next);
  };

  const next = nextThemePreference(theme);

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggle}
      data-theme-mode={theme}
      aria-label={`Theme is ${theme}. Switch to ${next}.`}
      title={`Theme: ${theme}`}
      suppressHydrationWarning
    >
      <Monitor className="theme-system-icon" aria-hidden="true" />
      <Sun className="theme-light-icon" aria-hidden="true" />
      <Moon className="theme-dark-icon" aria-hidden="true" />
    </button>
  );
}
