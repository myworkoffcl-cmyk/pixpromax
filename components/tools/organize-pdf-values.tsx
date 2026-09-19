"use client";

import { User, Zap, Lock } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function OrganizePdfValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("organizePdf.noAccount", "No Account"),
      description: t("organizePdf.noAccountDesc", "You don't need to sign up or create an account."),
    },
    {
      icon: Zap,
      title: t("organizePdf.browserBased", "Browser-Based"),
      description: t("organizePdf.browserBasedDesc", "Everything processes directly in your browser."),
    },
    {
      icon: Lock,
      title: t("organizePdf.private", "Private"),
      description: t("organizePdf.privateDesc", "Your PDF files stay on your device and are never uploaded."),
    },
  ];

  return (
    <div className="organize-pdf-values">
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
