"use client";

import { useTranslation } from "@/lib/use-translation";

interface LegalPageHeaderProps {
  pageName: "about" | "contact" | "disclaimer" | "faq" | "privacyPolicy" | "terms";
}

export function LegalPageHeader({ pageName }: LegalPageHeaderProps) {
  const { t } = useTranslation("policy");

  return (
    <div className="legal-page-header shell">
      <span className="kicker">{t(`${pageName}.kicker`, "")}</span>
      <h1>{t(`${pageName}.heading`, "")}</h1>
      <p className="lede">{t(`${pageName}.lede`, "")}</p>
    </div>
  );
}
