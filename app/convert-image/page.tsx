import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/convert-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("convert-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ConvertImagePage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <ConvertTool />
      </ToolPageShell>
    </main>
  );
}
