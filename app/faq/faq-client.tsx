"use client";

import { useTranslation } from "@/lib/use-translation";
import { LegalPageHeader } from "@/components/legal-page-header";
import { JsonLd } from "@/components/seo/json-ld";

export function FaqPageClient() {
  const { t } = useTranslation("policy");

  const faqs = t("faq.faqs", []);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.isArray(faqs) ? faqs.map((faq: any) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })) : [],
  };

  return (
    <article className="legal-page shell">
      <JsonLd data={jsonLdData} />
      <LegalPageHeader pageName="faq" />

      <div className="faq-list">
        {Array.isArray(faqs) && faqs.map((faq: any, index: number) => (
          <details key={index}>
            <summary>{faq.question}<span>+</span></summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </article>
  );
}
