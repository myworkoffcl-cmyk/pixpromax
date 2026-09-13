import type { Metadata } from "next";
import { CompressTool } from "@/components/tools/compress-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("compress-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function CompressImagePage() {
  return <ToolPage tool={tool} steps={["Choose a JPG, PNG, or WebP image from your device.", "Adjust the quality slider and compress the image locally.", "Compare the original and result, then download the smaller file."]} faqs={[["Will compression change my image dimensions?", "No. The compressor keeps the original pixel dimensions and focuses on reducing encoded file size."], ["Which quality should I use?", "Around 75–85% is a useful starting point for photos. Increase it for fine detail or reduce it for smaller downloads."], ["Is my image uploaded?", "No. Compression for this tool happens inside your browser."]]}> <CompressTool /> </ToolPage>;
}
