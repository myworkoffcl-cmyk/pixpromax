"use client";

import { Upload, Zap, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function OrganizePdfGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t("organizePdf.step1Title", "Upload a PDF"),
      description: t("organizePdf.step1Desc", "Choose a PDF file from your computer"),
    },
    {
      number: 2,
      icon: Zap,
      title: t("organizePdf.step2Title", "Organize Pages"),
      description: t("organizePdf.step2Desc", "Reorder or remove pages as needed"),
    },
    {
      number: 3,
      icon: Download,
      title: t("organizePdf.step3Title", "Download"),
      description: t("organizePdf.step3Desc", "Download your organized PDF"),
    },
  ];

  return (
    <div className="organize-pdf-guide">
      <h3>{t("organizePdf.howItWorks", "How It Works")}</h3>
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
