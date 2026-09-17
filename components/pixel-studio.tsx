"use client";

import { ArrowRight, ArrowUpRight, ScanFace, Lock, CircleCheck, Brain, ImageDown, Aperture, FileStack, ChevronDown, Zap, ShieldCheck } from "lucide-react";
import Link from "@/components/site-link";
import { tools } from "@/config/tools";
import { WorkspaceEntry } from "@/components/workspace/workspace-entry";
import { useState } from "react";
import { useTranslation } from "@/lib/use-translation";

const SHOWN_BY_DEFAULT = 6;

export function PixelStudio() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const { t } = useTranslation("home");

  const shortcuts = [
    { href: "/image-tools/compress", title: t("shortcuts.compress.title", "Less size. More room."), text: t("shortcuts.compress.text", "Compress an image"), icon: ImageDown, style: "shrink", detail: "JPG · PNG · WebP" },
    { href: "/compress-to-target-size", title: t("shortcuts.fit.title", "Make it fit."), text: t("shortcuts.fit.text", "Set a file-size limit"), icon: Aperture, style: "fit", detail: "20 KB · 50 KB · Custom" },
    { href: "/merge-pdf", title: t("shortcuts.merge.title", "Pages together."), text: t("shortcuts.merge.text", "Merge PDF files"), icon: FileStack, style: "apply", detail: "Local · private" },
  ];

  const active = tools.filter(t => t.status === "active");
  const isDocumentTool = (tool: (typeof tools)[number]) => tool.category === "PDF tools" || tool.category === "Documents";
  const engineSlugs = ["compress-image", "resize-image", "crop-image", "convert-image"];

  const imageTools = active.filter(tool => !isDocumentTool(tool) && !engineSlugs.includes(tool.slug));
  const documentTools = active.filter(isDocumentTool);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const sections = [
    { name: t("sections.imageTools", "Image tools"), items: imageTools },
    { name: t("sections.documentTools", "Document tools"), items: documentTools },
  ];

  return <div className="pixel-studio shell">
    <div className="studio-main">
      <div className="studio-heading"><div><span className="studio-overline"><span /> {t("studio.badge", "FAST, FREE, ON YOUR DEVICE")}</span><h1>{t("studio.heading", "Files ready.")}<br className="mobile-break" /> <em>{t("studio.subheading", "In moments.")}</em></h1><p>{t("studio.description", "Resize images, prepare applications, and manage PDFs without uploading a file.")}</p></div><span className="studio-stamp"><Zap aria-hidden="true" />{t("studio.stamp", "No account.") }<br />{t("studio.stamp2", "No watermark.")}</span><Link href="/privacy-policy" className="privacy-badge"><ShieldCheck aria-hidden="true" /><strong>{t("studio.privacy", "100% Private")}</strong><span>{t("studio.privacyText", "Files stay on your device")}</span><ArrowUpRight className="privacy-badge-arrow" aria-hidden="true" /></Link></div>
      <section className="studio-shortcuts" aria-label="Quick image tasks">{shortcuts.map(item => {
        const Icon = item.icon;
        return <Link href={item.href} key={item.href} className={`studio-shortcut ${item.style}`}><span className="shortcut-top"><Icon aria-hidden="true" /><ArrowUpRight aria-hidden="true" /></span><strong>{item.title}</strong><span>{item.text}</span><small>{item.detail}</small></Link>;
      })}</section>
      <div className="studio-directory" id="tools">
        {sections.map(section => {
          const isExpanded = expandedSections[section.name] || false;
          const displayedItems = isExpanded ? section.items : section.items.slice(0, SHOWN_BY_DEFAULT);
          const hasMore = section.items.length > SHOWN_BY_DEFAULT;

          return <section className="directory-group" aria-labelledby={`directory-${section.name.toLowerCase().replaceAll(" ", "-")}`} key={section.name}>
            <div className="directory-title"><h2 id={`directory-${section.name.toLowerCase().replaceAll(" ", "-")}`}>{section.name}</h2><span>{section.items.length} {section.items.length === 1 ? t("studio.tool", "tool") : t("studio.tools", "tools")}</span></div>
            {section.name === t("sections.imageTools", "Image tools") && <WorkspaceEntry />}
            <div className="studio-tool-grid">{displayedItems.map(tool => {
              const Icon = tool.icon;
              return <Link href={`/${tool.slug}`} className={`studio-tool accent-${tool.accent}`} key={tool.slug}><span className="studio-tool-icon"><Icon aria-hidden="true" /></span><div><h3>{tool.name}</h3><p>{tool.description}</p></div><ArrowUpRight className="studio-tool-arrow" aria-hidden="true" /></Link>;
            })}</div>
            {hasMore && (
              <button
                onClick={() => toggleSection(section.name)}
                className="studio-expand-button"
                aria-expanded={isExpanded}
              >
                <ChevronDown className={`expand-icon ${isExpanded ? "expanded" : ""}`} aria-hidden="true" />
                {isExpanded ? t("studio.showFewer", `Show fewer ${section.name.toLowerCase()}`) : t("studio.showMore", `Show ${section.items.length - SHOWN_BY_DEFAULT} more ${section.name.toLowerCase()}`)}
              </button>
            )}
          </section>;
        })}
      </div>
      <div className="studio-promise">
        <div className="promise-card">
          <div className="promise-icon promise-icon-blue"><Lock aria-hidden="true" /></div>
          <span>{t("studio.promise1", "Processed on your device")}</span>
        </div>
        <div className="promise-card">
          <div className="promise-icon promise-icon-green"><CircleCheck aria-hidden="true" /></div>
          <span>{t("studio.promise2", "No watermark")}</span>
        </div>
        <div className="promise-card">
          <div className="promise-icon promise-icon-purple"><Brain aria-hidden="true" /></div>
          <span>{t("studio.promise3", "No AI needed")}</span>
        </div>
      </div>
      <Link className="studio-application" href="/passport-photo-resizer"><span className="application-icon"><ScanFace aria-hidden="true" /></span><div><span>{t("studio.photoTools", "PHOTO & APPLICATION TOOLS")}</span><h2>{t("studio.photoTitle", "Right dimensions. One less worry.")}</h2><p>{t("studio.photoDesc", "Crop and position your photo with size presets. Always check your application's official requirements.")}</p></div><span className="application-link">{t("studio.photoLink", "Prepare a photo")} <ArrowRight aria-hidden="true" /></span></Link>
    </div>
  </div>;
}
