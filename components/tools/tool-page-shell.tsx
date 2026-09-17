import Link from "@/components/site-link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { getTool } from "@/config/tools";
import { SITE_URL } from "@/config/site";
import type { ToolConfig } from "@/types/tool";

interface ToolPageShellProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const related = tool.related.map(getTool).filter((item): item is ToolConfig => Boolean(item));

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, url: `${SITE_URL}/${tool.slug}`, description: tool.longDescription, applicationCategory: "MultimediaApplication", operatingSystem: "Any modern web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: tool.name, item: `${SITE_URL}/${tool.slug}` }] }} />

      <div className="workspace-category-header shell">
        <h1>{tool.name}</h1>
        <p>{tool.longDescription}</p>
      </div>

      <section className="tool-workspace shell">
        {children}
      </section>

      {related.length > 0 && (
        <section className="related-section shell">
          <div className="section-heading">
            <div>
              <span className="kicker">KEEP WORKING</span>
              <h2>Related tools.</h2>
            </div>
          </div>
          <div className="related-grid">
            {related.map((item) => {
              const RelatedIcon = item.icon;
              return (
                <Link href={`/${item.slug}`} key={item.slug}>
                  <RelatedIcon />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>
                  <ArrowRight />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
