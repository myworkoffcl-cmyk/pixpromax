import type { Metadata } from "next";
import { PassportTool } from "@/components/tools/passport-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("passport-photo-maker")!;
export const metadata: Metadata = toolMetadata(tool);

export default function PassportPhotoPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <PassportTool />
      </ToolPageShell>
    </main>
  );
}
