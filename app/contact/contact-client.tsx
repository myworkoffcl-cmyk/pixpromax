"use client";

import { useTranslation } from "@/lib/use-translation";
import { LegalPageHeader } from "@/components/legal-page-header";

export function ContactPageClient() {
  const { t } = useTranslation("policy");

  const sections = t("contact.sections", []);

  return (
    <article className="legal-page shell">
      <LegalPageHeader pageName="contact" />

      {Array.isArray(sections) && sections.map((section: any, index: number) => (
        <section key={index}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </article>
  );
}
