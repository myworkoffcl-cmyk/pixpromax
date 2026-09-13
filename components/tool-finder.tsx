"use client";

import Link from "@/components/site-link";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/config/tools";
import { useState } from "react";

const categories = ["All tools", "Size & quality", "Applications", "Convert & export"];
const groups: Record<string, string[]> = {
  "Size & quality": ["compress-image", "resize-image", "resize-image-to-kb", "crop-image"],
  "Applications": ["resize-image-to-kb", "signature-resizer", "passport-photo-maker"],
  "Convert & export": ["convert-image", "image-to-pdf", "batch-converter"],
};

const quickActions = [
  { label: "Compress", href: "/compress-image" },
  { label: "Resize", href: "/resize-image" },
  { label: "File size in KB", href: "/resize-image-to-kb" },
  { label: "Passport", href: "/passport-photo-maker" },
  { label: "Signature", href: "/signature-resizer" },
  { label: "Image to PDF", href: "/image-to-pdf" },
];

export function ToolFinder() {
  const [category, setCategory] = useState("All tools");
  const activeTools = tools.filter((tool) => tool.status === "active");

  return (
    <div className="tool-finder">
      <div className="tool-directory-heading"><h2>What do you need to do?</h2><span>9 tools · local processing</span></div>
      <div className="task-categories" role="group" aria-label="Filter tools by task">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <nav className="quick-actions" aria-label="Popular image tasks">
        <span>Quick:</span>
        {quickActions.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}
      </nav>
      <div className="tool-grid task-tool-grid" id="tools">
        {activeTools.map((tool) => (
          <div key={tool.slug} hidden={category !== "All tools" && !groups[category]?.includes(tool.slug)} data-tool-search={`${tool.name} ${tool.description} ${tool.category}`.toLowerCase()}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </div>
  );
}
