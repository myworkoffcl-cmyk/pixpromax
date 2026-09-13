"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Grid2X2, SlidersHorizontal, ScanFace, Layers, ShieldCheck, Zap, Check, ImageDown, Aperture, PenLine } from "lucide-react";
import Link from "@/components/site-link";
import { tools } from "@/config/tools";

const groups = [
  { name: "All tools", icon: Grid2X2, slugs: [] },
  { name: "Everyday edits", icon: SlidersHorizontal, slugs: ["compress-image", "resize-image", "crop-image", "resize-image-to-kb"] },
  { name: "Application photos", icon: ScanFace, slugs: ["passport-photo-maker", "signature-resizer", "resize-image-to-kb"] },
  { name: "Convert & batch", icon: Layers, slugs: ["convert-image", "batch-converter", "image-to-pdf"] },
];
const shortcuts = [
  { href: "/compress-image", title: "Less size. More room.", text: "Compress an image", icon: ImageDown, style: "shrink", detail: "JPG · PNG · WebP" },
  { href: "/resize-image-to-kb", title: "Make it fit.", text: "Set a file-size limit", icon: Aperture, style: "fit", detail: "20 KB · 50 KB · Custom" },
  { href: "/signature-resizer", title: "Ready to apply.", text: "Prepare your signature", icon: PenLine, style: "apply", detail: "Dimensions + file size" },
];

export function PixelStudio() {
  const [selected, setSelected] = useState(0);
  const active = tools.filter(t => t.status === "active");
  const visible = active.filter(t => selected === 0 || groups[selected].slugs.includes(t.slug));
  return <div className="pixel-studio shell">
    <aside className="studio-rail">
      <span className="rail-label">YOUR TOOLKIT</span>
      <nav aria-label="Tool categories">{groups.map((group, index) => {
        const Icon = group.icon;
        return <button type="button" key={group.name} aria-pressed={selected === index} onClick={() => setSelected(index)}><Icon aria-hidden="true" /><span>{group.name}</span><small>{index === 0 ? active.length : group.slugs.length}</small></button>;
      })}</nav>
      <div className="rail-note"><ShieldCheck aria-hidden="true" /><strong>Your images.<br />Your device.</strong><p>Image processing stays in your browser.</p><Link href="/privacy">How privacy works <ArrowUpRight aria-hidden="true" /></Link></div>
    </aside>
    <div className="studio-main">
      <div className="studio-heading"><div><span className="studio-overline"><span /> SMALL TOOLS. BIG POSSIBILITIES.</span><h1>A little edit.<br className="mobile-break" /> A <em>perfect fit.</em></h1><p>Make your images ready for whatever comes next.</p></div><span className="studio-stamp"><Zap aria-hidden="true" />Free tools.<br />Full potential.</span></div>
      <section className="studio-shortcuts" aria-label="Quick image tasks">{shortcuts.map(item => {
        const Icon = item.icon;
        return <Link href={item.href} key={item.href} className={`studio-shortcut ${item.style}`}><span className="shortcut-top"><Icon aria-hidden="true" /><ArrowUpRight aria-hidden="true" /></span><strong>{item.title}</strong><span>{item.text}</span><small>{item.detail}</small></Link>;
      })}</section>
      <section className="studio-directory" id="tools" aria-label="Image tools">
        <div className="directory-title"><h2>{groups[selected].name}</h2><span aria-live="polite">{visible.length} tools, zero watermarks</span></div>
        <div className="studio-tool-grid">{active.map(tool => {
          const Icon = tool.icon;
          return <Link hidden={!visible.includes(tool)} href={`/${tool.slug}`} className={`studio-tool accent-${tool.accent}`} key={tool.slug}><span className="studio-tool-icon"><Icon aria-hidden="true" /></span><div><h3>{tool.name}</h3><p>{tool.description}</p></div><ArrowUpRight className="studio-tool-arrow" aria-hidden="true" /></Link>;
        })}</div>
      </section>
      <div className="studio-promise"><span><ShieldCheck aria-hidden="true" /> Processed on your device</span><span><Check aria-hidden="true" /> No watermark</span><span><Zap aria-hidden="true" /> No AI needed</span></div>
      <Link className="studio-application" href="/passport-photo-maker"><span className="application-icon"><ScanFace aria-hidden="true" /></span><div><span>PHOTO & APPLICATION TOOLS</span><h2>Right dimensions. One less worry.</h2><p>Crop and position your photo with size presets. Always check your application’s official requirements.</p></div><span className="application-link">Prepare a photo <ArrowRight aria-hidden="true" /></span></Link>
    </div>
  </div>;
}
