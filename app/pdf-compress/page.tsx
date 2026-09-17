import type { Metadata } from "next";
import { PdfCompressTool } from "@/components/tools/pdf-compress-tool";
import { JsonLd } from "@/components/seo/json-ld";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("pdf-compress")!;
export const metadata: Metadata = toolMetadata(tool);

export default function PdfCompressPage() {
  const schemas = getToolSchemas(tool);

  return (
    <main className="workspace-page">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="workspace-category-header shell">
        <h1>{tool.name}</h1>
        <p>{tool.longDescription}</p>
      </div>
      <PdfCompressTool />
    </main>
  );
}
