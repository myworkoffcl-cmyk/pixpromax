import type { Metadata } from "next";
import { SignatureTool } from "@/components/tools/signature-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("signature-resizer")!;
export const metadata: Metadata = toolMetadata(tool);

export default function SignatureResizerPage() {
  return <ToolPage tool={tool} steps={["Upload a clear signature image and choose a sourced application preset or general limit.", "Review the dimensions, maximum KB value, cycle, and official source before processing.", "Download the prepared JPG and confirm it visually before submitting to the portal."]} faqs={[["Will this guarantee my signature is accepted?", "No. PixProMax can prepare dimensions and file size, but portals may also enforce current cycle rules, signature clarity, ink color, and other checks."], ["Why are presets tied to a year or cycle?", "Application requirements change. Cycle labels and last-checked dates help prevent an older requirement from appearing universal."], ["Are signatures uploaded?", "No. Resizing and compression happen locally in your browser."]]}> <SignatureTool /> </ToolPage>;
}
