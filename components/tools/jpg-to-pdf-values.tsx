"use client";

import { User, Zap, Lock } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function JpgToPdfValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("jpgToPdf.noAccount", "No Account Needed"),
      description: t("jpgToPdf.noAccountDesc", "Start instantly without sign-up"),
    },
    {
      icon: Zap,
      title: t("jpgToPdf.browserBased", "Browser-Based"),
      description: t("jpgToPdf.browserBasedDesc", "Fast processing locally on your device"),
    },
    {
      icon: Lock,
      title: t("jpgToPdf.private", "100% Private"),
      description: t("jpgToPdf.privateDesc", "Files never leave your device"),
    },
  ];

  return (
    <div className="jpg-to-pdf-values">
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
