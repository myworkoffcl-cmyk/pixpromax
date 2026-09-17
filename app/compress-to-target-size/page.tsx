import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Compress Image to Target Size",
  description: "Compress images to a specific file size target (KB). Presets: 50KB, 100KB, 200KB, 500KB, or custom.",
  alternates: { canonical: "/compress-to-target-size" },
};

const toolName = "Compress to Target Size";
const toolDesc = "Compress images to a specific KB target.";
const toolSlug = "compress-to-target-size";

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: toolName,
        item: `${SITE_URL.replace(/\/$/, "")}/${toolSlug}`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    description: toolDesc,
    applicationCategory: "Multimedia",
    operatingSystem: "Web",
    url: `${SITE_URL.replace(/\/$/, "")}/${toolSlug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
];

export default function CompressToTargetSizePage() {
  return (
    <main className="workspace-page">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="workspace-category-header shell">
        <h1>{toolName}</h1>
        <p>{toolDesc}</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "compress",
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
