"use client";

import { Upload, Zap, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function OrganizePdfGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t("organizePdf.step1Title"),
      description: t("organizePdf.step1Desc"),
    },
    {
      number: 2,
      icon: Zap,
      title: t("organizePdf.step2Title"),
      description: t("organizePdf.step2Desc"),
    },
    {
      number: 3,
      icon: Download,
      title: t("organizePdf.step3Title"),
      description: t("organizePdf.step3Desc"),
    },
  ];

  return (
    <div className="organize-pdf-guide">
      <h3>{t("organizePdf.howItWorks")}</h3>
      <div className="steps-grid">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <Icon className="step-icon" aria-hidden="true" />
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
