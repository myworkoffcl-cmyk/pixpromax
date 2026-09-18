import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { OrganizePdfGuide } from "@/components/tools/organize-pdf-guide";
import { OrganizePdfValues } from "@/components/tools/organize-pdf-values";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolPageHeader } from "@/components/tool-page-header";
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
      <ToolPageHeader toolSlug={tool.slug} toolName={tool.name} toolLongDescription={tool.longDescription} />
      <div className="tool-workspace-wrapper">
        <PdfTool mode="organize" />
        <OrganizePdfValues />
        <OrganizePdfGuide />
      </div>
    </main>
  );
}
