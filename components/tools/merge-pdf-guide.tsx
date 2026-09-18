"use client";

import { Upload, Zap, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function MergePdfGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      icon: Upload,
      title: t("mergePdf.step1Title", "Upload your PDFs"),
      description: t("mergePdf.step1Desc", "Select or drag multiple PDF files at once"),
    },
    {
      icon: Zap,
      title: t("mergePdf.step2Title", "Arrange in order"),
      description: t("mergePdf.step2Desc", "Reorder PDFs by dragging or using arrow buttons"),
    },
    {
      icon: Download,
      title: t("mergePdf.step3Title", "Download merged file"),
      description: t("mergePdf.step3Desc", "One combined PDF, ready to use"),
    },
  ];

  return (
    <div className="merge-pdf-guide">
      <div className="guide-content">
        <h2>{t("mergePdf.howItWorks", "How it works")}</h2>
        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="step-card">
                <div className="step-number">Step {index + 1}</div>
                <div className="step-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
