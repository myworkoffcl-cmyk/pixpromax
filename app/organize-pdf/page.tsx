import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { JsonLd } from "@/components/seo/json-ld";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("organize-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function OrganizePdfPage() {
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
      <PdfTool mode="organize" />
    </main>
  );
}
