import type { Metadata } from "next";
import { SignatureTool } from "@/components/tools/signature-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("signature-resizer")!;
export const metadata: Metadata = toolMetadata(tool);

export default function SignatureResizerPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <SignatureTool />
      </ToolPageShell>
    </main>
  );
}
