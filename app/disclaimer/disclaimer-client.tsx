"use client";

import { useTranslation } from "@/lib/use-translation";
import { LegalPageHeader } from "@/components/legal-page-header";

export function DisclaimerPageClient() {
  const { t } = useTranslation("policy");

  const sections = t("disclaimer.sections", []);

  return (
    <article className="legal-page shell">
      <LegalPageHeader pageName="disclaimer" />

      {Array.isArray(sections) && sections.map((section: any, index: number) => (
        <section key={index}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </article>
  );
}
