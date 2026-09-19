"use client";

import { Upload, Zap, Download } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function PdfCompressGuide() {
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t("pdfCompress.step1Title", "Upload your PDF"),
      description: t("pdfCompress.step1Desc", "Choose one PDF file from your device"),
    },
    {
      number: 2,
      icon: Zap,
      title: t("pdfCompress.step2Title", "Choose quality"),
      description: t("pdfCompress.step2Desc", "Select compression level for file size reduction"),
    },
    {
      number: 3,
      icon: Download,
      title: t("pdfCompress.step3Title", "Download PDF"),
      description: t("pdfCompress.step3Desc", "Get your compressed PDF file"),
    },
  ];

  return (
    <div className="pdf-compress-guide">
      <h3>{t("pdfCompress.howItWorks", "How it works")}</h3>
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
