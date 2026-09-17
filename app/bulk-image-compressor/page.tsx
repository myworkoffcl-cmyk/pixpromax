import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { JsonLd } from "@/components/seo/json-ld";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("bulk-image-compressor")!;
export const metadata: Metadata = toolMetadata(tool);

export default function BulkImageCompressorPage() {
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
      <UniversalWorkspace
        init={{
          initialEngine: "compress",
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
