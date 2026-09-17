"use client";

import { useTranslation } from "@/lib/use-translation";
import { LegalPageHeader } from "@/components/legal-page-header";

export function PrivacyPolicyPageClient() {
  const { t } = useTranslation("policy");

  const sections = t("privacyPolicy.sections", []);
  const lastUpdated = t("privacyPolicy.lastUpdated", "");

  return (
    <article className="legal-page shell">
      <LegalPageHeader pageName="privacyPolicy" />

      {lastUpdated && <p className="legal-updated">{lastUpdated}</p>}

      {Array.isArray(sections) && sections.map((section: any, index: number) => (
        <section key={index}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </article>
  );
}
