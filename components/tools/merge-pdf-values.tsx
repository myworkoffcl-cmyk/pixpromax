"use client";

import { Lock, Zap, User } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function MergePdfValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("mergePdf.noAccount", "No Account Needed"),
      description: t("mergePdf.noAccountDesc", "Start instantly"),
    },
    {
      icon: Zap,
      title: t("mergePdf.browserBased", "Browser-Based"),
      description: t("mergePdf.browserBasedDesc", "Fast processing"),
    },
    {
      icon: Lock,
      title: t("mergePdf.private", "100% Private"),
      description: t("mergePdf.privateDesc", "Files never leave device"),
    },
  ];

  return (
    <div className="merge-pdf-values">
      {values.map((value, index) => {
        const Icon = value.icon;
        return (
          <div key={index} className="value-item">
            <div className="value-icon">
              <Icon aria-hidden="true" />
            </div>
            <strong>{value.title}</strong>
            <span>{value.description}</span>
          </div>
        );
      })}
    </div>
  );
}
