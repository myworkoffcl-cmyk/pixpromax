import type { Metadata } from "next";
import { BatchConverterTool } from "@/components/tools/batch-converter-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("batch-converter")!;
export const metadata: Metadata = toolMetadata(tool);

export default function BatchConverterPage() {
  return <ToolPage tool={tool} steps={["Add up to 20 JPG, PNG, or WebP images to the queue.", "Choose one output format and quality for the batch.", "Convert sequentially, retry individual failures, or download all completed images as a ZIP."]} faqs={[["Why are files processed sequentially?", "Limiting simultaneous work reduces memory pressure and keeps the browser responsive on larger batches."], ["What is the ZIP filename?", "Combined downloads use pixpromax-converted-images.zip."], ["Can one failed file stop the batch?", "No. Each image has its own status and failed items can be retried individually."]]}> <BatchConverterTool /> </ToolPage>;
}
