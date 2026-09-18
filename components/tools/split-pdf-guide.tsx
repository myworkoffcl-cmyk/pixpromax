"use client";

import { useTranslation } from "@/lib/use-translation";
import { Upload, Zap, Download } from "lucide-react";

export function SplitPdfGuide() {
  const { t } = useTranslation("common");

  return (
    <div className="split-pdf-guide">
      <div className="guide-content">
        <h2>{t("splitPdf.howItWorks", "How it works")}</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">{t("splitPdf.step1", "Step 1")}</div>
            <div className="step-icon">
              <Upload aria-hidden="true" size={24} />
            </div>
            <h3>{t("splitPdf.step1Title", "Upload your PDF")}</h3>
            <p>{t("splitPdf.step1Desc", "Choose one PDF file from your device")}</p>
          </div>
          <div className="step-card">
            <div className="step-number">{t("splitPdf.step2", "Step 2")}</div>
            <div className="step-icon">
              <Zap aria-hidden="true" size={24} />
            </div>
            <h3>{t("splitPdf.step2Title", "Select pages")}</h3>
            <p>{t("splitPdf.step2Desc", "Choose which pages to extract with visual preview")}</p>
          </div>
          <div className="step-card">
            <div className="step-number">{t("splitPdf.step3", "Step 3")}</div>
            <div className="step-icon">
              <Download aria-hidden="true" size={24} />
            </div>
            <h3>{t("splitPdf.step3Title", "Download your PDF")}</h3>
            <p>{t("splitPdf.step3Desc", "Get your extracted pages as a new PDF file")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
