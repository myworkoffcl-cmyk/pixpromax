"use client";

import { Upload, Zap, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function PdfToPngGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t("pdfToPng.step1Title", "Upload your PDF"),
      description: t("pdfToPng.step1Desc", "Choose one PDF file from your device"),
    },
    {
      number: 2,
      icon: Zap,
      title: t("pdfToPng.step2Title", "Choose quality"),
      description: t("pdfToPng.step2Desc", "Select PNG quality for transparency and size"),
    },
    {
      number: 3,
      icon: Download,
      title: t("pdfToPng.step3Title", "Download images"),
      description: t("pdfToPng.step3Desc", "Get all pages as PNG images in a ZIP file"),
    },
  ];

  return (
    <div className="pdf-to-png-guide">
      <h3>{t("pdfToPng.howItWorks", "How it works")}</h3>
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
