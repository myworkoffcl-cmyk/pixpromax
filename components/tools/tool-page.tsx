import Link from "@/components/site-link";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { getTool } from "@/config/tools";
import { SITE_URL } from "@/config/site";
import type { ToolConfig } from "@/types/tool";

interface ToolPageProps {
  tool: ToolConfig;
  children: React.ReactNode;
  steps: string[];
  faqs: [string, string][];
  privacyNote?: string;
}

export function ToolPage({ tool, children, steps, faqs, privacyNote = "Your image is processed directly in your browser and is not uploaded to our servers." }: ToolPageProps) {
  const Icon = tool.icon;
  const related = tool.related.map(getTool).filter((item): item is ToolConfig => Boolean(item));
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, url: `${SITE_URL}/${tool.slug}`, description: tool.longDescription, applicationCategory: "MultimediaApplication", operatingSystem: "Any modern web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: tool.name, item: `${SITE_URL}/${tool.slug}` }] }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }} />
      <nav className="tool-back shell" aria-label="Breadcrumb"><Link href="/">← All tools</Link></nav>
      <section className="tool-intro shell"><div className={`tool-title-icon accent-${tool.accent}`}><Icon aria-hidden="true" /></div><div className="tool-intro-copy"><span className="kicker">{tool.category} · {tool.status === "active" ? "Browser based" : "Future ready"}</span><h1>{tool.name}</h1><p>{tool.longDescription}</p></div><div className="privacy-chip"><LockKeyhole aria-hidden="true" /><span>{privacyNote}</span></div></section>
      <section className="tool-workspace shell"><ol className="workflow-guide" aria-label="Workflow overview"><li><b>01</b> Choose image</li><li><b>02</b> Make adjustments</li><li><b>03</b> Download</li></ol>{children}</section>
      <section className="tool-content shell"><div><span className="kicker">HOW IT WORKS</span><h2>From upload to download in a few clear steps.</h2><ol>{steps.map((step) => <li key={step}><span><CheckCircle2 /></span><p>{step}</p></li>)}</ol></div><aside><span className="kicker">BUILT WITH CARE</span><h3>Private when we say private.</h3><p>{privacyNote}</p><p>PixProMax uses browser APIs and purpose-built client libraries for active local tools. Object URLs and temporary canvas data are cleaned up after use.</p></aside></section>
      <section className="related-section shell"><div className="section-heading"><div><span className="kicker">KEEP WORKING</span><h2>Related image tools.</h2></div></div><div className="related-grid">{related.map((item) => { const RelatedIcon = item.icon; return <Link href={`/${item.slug}`} key={item.slug}><RelatedIcon /><span><strong>{item.name}</strong><small>{item.description}</small></span><ArrowRight /></Link>; })}</div></section>
      <AdSlot placement="tool-bottom" />
      <section className="tool-faq shell"><span className="kicker">QUESTIONS</span><h2>What to know before you start.</h2><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
    </>
  );
}
