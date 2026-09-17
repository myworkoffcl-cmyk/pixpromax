"use client";

import { useTranslation } from "@/lib/use-translation";

interface ToolPageHeaderProps {
  toolSlug: string;
  toolName: string;
  toolLongDescription: string;
}

export function ToolPageHeader({ toolSlug, toolName, toolLongDescription }: ToolPageHeaderProps) {
  const { t } = useTranslation("common");

  return (
    <div className="workspace-category-header shell">
      <h1>{t(`tools.${toolSlug}`, toolName)}</h1>
      <p>{t(`toolDescriptions.${toolSlug}`, toolLongDescription)}</p>
    </div>
  );
}
