import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("pdf-to-jpg")!;
export const metadata: Metadata = toolMetadata(tool);

export default function PdfToJpgPage() {
  return <ToolPage tool={tool} fileLabel="PDF" steps={["Choose one PDF from your device.", "Set a JPG quality that balances sharpness with file size.", "Download all converted pages in one ZIP file."]} faqs={[["Are my PDFs uploaded?", "No. Pages are rendered and converted locally in your browser."], ["Why do I receive a ZIP file?", "A PDF can contain many pages, so the JPG files are delivered together in one easy download."], ["Can I set a specific KB limit?", "This first version lets you choose JPG quality. Target-size optimization for PDF images is planned as a shared capability after its reliability is verified."]]}> <PdfTool mode="to-jpg" /> </ToolPage>;
}
