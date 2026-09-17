import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { JsonLd } from "@/components/seo/json-ld";
import { getTool } from "@/config/tools";
import { toolMetadata, getToolSchemas } from "@/lib/seo";

const tool = getTool("webp-to-jpg")!;
export const metadata: Metadata = toolMetadata(tool);

export default function WebpToJpgPage() {
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
          initialEngine: "convert",
          convert: { enabled: true, format: "image/jpeg" },
        }}
      />
    </main>
  );
}
