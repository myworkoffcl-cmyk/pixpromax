"use client";

import { Upload, Settings, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function JpgToPdfGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t("jpgToPdf.step1Title", "Upload your images"),
      description: t("jpgToPdf.step1Desc", "Select one or more JPG, PNG, or WebP images"),
    },
    {
      number: 2,
      icon: Settings,
      title: t("jpgToPdf.step2Title", "Arrange and configure"),
      description: t("jpgToPdf.step2Desc", "Reorder pages and choose page size, orientation, margins"),
    },
    {
      number: 3,
      icon: Download,
      title: t("jpgToPdf.step3Title", "Download PDF"),
      description: t("jpgToPdf.step3Desc", "Get your combined PDF file ready to use"),
    },
  ];

  return (
    <div className="jpg-to-pdf-guide">
      <h3>{t("jpgToPdf.howItWorks", "How it works")}</h3>
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
