import type { LucideIcon } from "lucide-react";

export type ToolStatus = "active" | "beta" | "coming-soon";

export interface ToolConfig {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  status: ToolStatus;
  icon: LucideIcon;
  accent: string;
  related: string[];
}
