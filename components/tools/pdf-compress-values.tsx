"use client";

import { User, Zap, Lock } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function PdfCompressValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("pdfCompress.noAccount", "No Account Needed"),
      description: t("pdfCompress.noAccountDesc", "Start instantly without sign-up"),
    },
    {
      icon: Zap,
      title: t("pdfCompress.browserBased", "Browser-Based"),
      description: t("pdfCompress.browserBasedDesc", "Fast processing locally on your device"),
    },
    {
      icon: Lock,
      title: t("pdfCompress.private", "100% Private"),
      description: t("pdfCompress.privateDesc", "Files never leave your device"),
    },
  ];

  return (
    <div className="pdf-compress-values">
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
