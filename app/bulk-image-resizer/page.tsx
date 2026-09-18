import type { Metadata } from "next";
import { BulkImageTool } from "@/components/tools/bulk-image-tool";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolPageHeader } from "@/components/tool-page-header";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("bulk-image-resizer")!;
export const metadata: Metadata = toolMetadata(tool);

export default function BulkImageResizerPage() {
  const schemas = getToolSchemas(tool);

  return (
    <main className="workspace-page">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <ToolPageHeader toolSlug={tool.slug} toolName={tool.name} toolLongDescription={tool.longDescription} />
      <BulkImageTool mode="resize" />
    </main>
  );
}
