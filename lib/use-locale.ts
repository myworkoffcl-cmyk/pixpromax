"use client";

import { useContext } from "react";
import { LocaleContext as LocaleContextType } from "@/types/locale";
import { createContext } from "react";

// This is created in locale-provider.tsx
export const LocaleContext = createContext<LocaleContextType | undefined>(
  undefined
);

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
