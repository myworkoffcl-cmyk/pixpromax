import type { Metadata } from "next";
import { CropTool } from "@/components/tools/crop-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("crop-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function CropImagePage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <CropTool />
      </ToolPageShell>
    </main>
  );
}
