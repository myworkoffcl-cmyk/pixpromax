"use client";

import { User, Zap, Lock } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function PdfToJpgValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("pdfToJpg.noAccount", "No Account Needed"),
      description: t("pdfToJpg.noAccountDesc", "Start instantly without sign-up"),
    },
    {
      icon: Zap,
      title: t("pdfToJpg.browserBased", "Browser-Based"),
      description: t("pdfToJpg.browserBasedDesc", "Fast processing locally on your device"),
    },
    {
      icon: Lock,
      title: t("pdfToJpg.private", "100% Private"),
      description: t("pdfToJpg.privateDesc", "Files never leave your device"),
    },
  ];

  return (
    <div className="pdf-to-jpg-values">
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
