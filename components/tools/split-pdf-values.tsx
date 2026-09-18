"use client";

import { useTranslation } from "@/lib/use-translation";
import { User, Zap, Lock } from "lucide-react";

export function SplitPdfValues() {
  const { t } = useTranslation("common");

  return (
    <div className="split-pdf-values">
      <div className="value-item">
        <div className="value-icon">
          <User aria-hidden="true" size={24} />
        </div>
        <strong>{t("splitPdf.noAccount", "No Account Needed")}</strong>
        <span>{t("splitPdf.noAccountDesc", "Start instantly without sign-up")}</span>
      </div>
      <div className="value-item">
        <div className="value-icon">
          <Zap aria-hidden="true" size={24} />
        </div>
        <strong>{t("splitPdf.browserBased", "Browser-Based")}</strong>
        <span>{t("splitPdf.browserBasedDesc", "Fast processing locally on your device")}</span>
      </div>
      <div className="value-item">
        <div className="value-icon">
          <Lock aria-hidden="true" size={24} />
        </div>
        <strong>{t("splitPdf.private", "100% Private")}</strong>
        <span>{t("splitPdf.privateDesc", "Files never leave your device")}</span>
      </div>
    </div>
  );
}
