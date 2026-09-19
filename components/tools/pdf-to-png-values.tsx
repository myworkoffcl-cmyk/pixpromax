"use client";

import { User, Zap, Lock } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function PdfToPngValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("pdfToPng.noAccount", "No Account Needed"),
      description: t("pdfToPng.noAccountDesc", "Start instantly without sign-up"),
    },
    {
      icon: Zap,
      title: t("pdfToPng.browserBased", "Browser-Based"),
      description: t("pdfToPng.browserBasedDesc", "Fast processing locally on your device"),
    },
    {
      icon: Lock,
      title: t("pdfToPng.private", "100% Private"),
      description: t("pdfToPng.privateDesc", "Files never leave your device"),
    },
  ];

  return (
    <div className="pdf-to-png-values">
      {values.map((value, index) => {
        const Icon = value.icon;
        return (
          <div key={index} className="value-item">
            <Icon className="value-icon" aria-hidden="true" />
            <h4>{value.title}</h4>
            <p>{value.description}</p>
          </div>
        );
      })}
    </div>
  );
}
