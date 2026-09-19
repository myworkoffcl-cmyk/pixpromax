"use client";

import { Upload, Zap, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function PdfToJpgGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t("pdfToJpg.step1Title", "Upload your PDF"),
      description: t("pdfToJpg.step1Desc", "Choose one PDF file from your device"),
    },
    {
      number: 2,
      icon: Zap,
      title: t("pdfToJpg.step2Title", "Choose quality"),
      description: t("pdfToJpg.step2Desc", "Select JPG quality for file size vs clarity"),
    },
    {
      number: 3,
      icon: Download,
      title: t("pdfToJpg.step3Title", "Download images"),
      description: t("pdfToJpg.step3Desc", "Get all pages as JPG images in a ZIP file"),
    },
  ];

  return (
    <div className="pdf-to-jpg-guide">
      <h3>{t("pdfToJpg.howItWorks", "How it works")}</h3>
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
