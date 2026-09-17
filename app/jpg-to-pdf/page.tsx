import type { Metadata } from "next";
import { ImageToPdfTool } from "@/components/tools/image-to-pdf-tool";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("jpg-to-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function JpgToPdfPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>{tool.name}</h1>
        <p>{tool.longDescription}</p>
      </div>
      <ImageToPdfTool />
    </main>
  );
}
