import { ArrowRight, ArrowUpRight, ScanFace, ShieldCheck, Zap, Check, ImageDown, Aperture, FileStack } from "lucide-react";
import Link from "@/components/site-link";
import { tools } from "@/config/tools";

const shortcuts = [
  { href: "/compress-image", title: "Less size. More room.", text: "Compress an image", icon: ImageDown, style: "shrink", detail: "JPG · PNG · WebP" },
  { href: "/resize-image-to-kb", title: "Make it fit.", text: "Set a file-size limit", icon: Aperture, style: "fit", detail: "20 KB · 50 KB · Custom" },
      { href: "/merge-pdf", title: "Pages together.", text: "Merge PDF files", icon: FileStack, style: "apply", detail: "Local · private" },
];

export function PixelStudio() {
  const active = tools.filter(t => t.status === "active");
  const isDocumentTool = (tool: (typeof tools)[number]) => tool.category === "PDF tools" || tool.category === "Documents";
  const sections = [
    { name: "Image tools", items: active.filter(tool => !isDocumentTool(tool)) },
    { name: "Document tools", items: active.filter(isDocumentTool) },
  ];
  return <div className="pixel-studio shell">
    <div className="studio-main">
      <div className="studio-heading"><div><span className="studio-overline"><span /> FAST, FREE, ON YOUR DEVICE</span><h1>Files ready.<br className="mobile-break" /> <em>In moments.</em></h1><p>Resize images, prepare applications, and manage PDFs without uploading a file.</p></div><span className="studio-stamp"><Zap aria-hidden="true" />No account.<br />No watermark.</span></div>
      <section className="studio-shortcuts" aria-label="Quick image tasks">{shortcuts.map(item => {
        const Icon = item.icon;
        return <Link href={item.href} key={item.href} className={`studio-shortcut ${item.style}`}><span className="shortcut-top"><Icon aria-hidden="true" /><ArrowUpRight aria-hidden="true" /></span><strong>{item.title}</strong><span>{item.text}</span><small>{item.detail}</small></Link>;
      })}</section>
      <div className="studio-directory" id="tools">
        {sections.map(section => <section className="directory-group" aria-labelledby={`directory-${section.name.toLowerCase().replaceAll(" ", "-")}`} key={section.name}>
          <div className="directory-title"><h2 id={`directory-${section.name.toLowerCase().replaceAll(" ", "-")}`}>{section.name}</h2><span>{section.items.length} {section.items.length === 1 ? "tool" : "tools"}</span></div>
          <div className="studio-tool-grid">{section.items.map(tool => {
            const Icon = tool.icon;
            return <Link href={`/${tool.slug}`} className={`studio-tool accent-${tool.accent}`} key={tool.slug}><span className="studio-tool-icon"><Icon aria-hidden="true" /></span><div><h3>{tool.name}</h3><p>{tool.description}</p></div><ArrowUpRight className="studio-tool-arrow" aria-hidden="true" /></Link>;
          })}</div>
        </section>)}
      </div>
      <div className="studio-promise"><span><ShieldCheck aria-hidden="true" /> Processed on your device</span><span><Check aria-hidden="true" /> No watermark</span><span><Zap aria-hidden="true" /> No AI needed</span></div>
      <Link className="studio-application" href="/passport-photo-maker"><span className="application-icon"><ScanFace aria-hidden="true" /></span><div><span>PHOTO & APPLICATION TOOLS</span><h2>Right dimensions. One less worry.</h2><p>Crop and position your photo with size presets. Always check your application’s official requirements.</p></div><span className="application-link">Prepare a photo <ArrowRight aria-hidden="true" /></span></Link>
    </div>
  </div>;
}
