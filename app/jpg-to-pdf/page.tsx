import type { Metadata } from "next";
import { ImageToPdfTool } from "@/components/tools/image-to-pdf-tool";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolPageHeader } from "@/components/tool-page-header";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("jpg-to-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function JpgToPdfPage() {
  const schemas = getToolSchemas(tool);

  return (
    <main className="workspace-page">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <ToolPageHeader toolSlug={tool.slug} toolName={tool.name} toolLongDescription={tool.longDescription} />
      <ImageToPdfTool />
    </main>
  );
}
