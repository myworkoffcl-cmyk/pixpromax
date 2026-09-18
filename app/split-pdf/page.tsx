import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { SplitPdfGuide } from "@/components/tools/split-pdf-guide";
import { SplitPdfValues } from "@/components/tools/split-pdf-values";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolPageHeader } from "@/components/tool-page-header";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("split-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function SplitPdfPage() {
  const schemas = getToolSchemas(tool);

  return (
    <main className="workspace-page">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <ToolPageHeader toolSlug={tool.slug} toolName={tool.name} toolLongDescription={tool.longDescription} />
      <div className="tool-workspace-wrapper">
        <PdfTool mode="split" />
        <SplitPdfValues />
        <SplitPdfGuide />
      </div>
    </main>
  );
}
