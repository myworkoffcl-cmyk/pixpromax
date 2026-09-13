import Link from "@/components/site-link";
import { ArrowUpRight } from "lucide-react";
import type { ToolConfig } from "@/types/tool";

export function ToolCard({ tool, featured = false }: { tool: ToolConfig; featured?: boolean }) {
  const Icon = tool.icon;
  return (
    <Link className={`tool-card accent-${tool.accent} ${featured ? "featured" : ""}`} href={`/${tool.slug}`}>
      <div className="tool-card-top"><span className="tool-icon"><Icon aria-hidden="true" /></span><ArrowUpRight className="tool-arrow" aria-hidden="true" /></div>
      <div><span className="eyebrow">{tool.category}</span>{tool.status !== "active" && <span className="status-pill">{tool.status === "coming-soon" ? "Coming soon" : "Beta"}</span>}</div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
    </Link>
  );
}
