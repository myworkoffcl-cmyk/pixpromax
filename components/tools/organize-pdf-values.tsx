"use client";

import { User, Zap, Lock } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";

export function OrganizePdfValues() {
  const { t } = useTranslation("common");

  const values = [
    {
      icon: User,
      title: t("organizePdf.noAccount"),
      description: t("organizePdf.noAccountDesc"),
    },
    {
      icon: Zap,
      title: t("organizePdf.browserBased"),
      description: t("organizePdf.browserBasedDesc"),
    },
    {
      icon: Lock,
      title: t("organizePdf.private"),
      description: t("organizePdf.privateDesc"),
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
