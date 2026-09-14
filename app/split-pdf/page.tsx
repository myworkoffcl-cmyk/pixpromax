import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("split-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function SplitPdfPage() {
  return <ToolPage tool={tool} fileLabel="PDF" steps={["Choose one PDF from your device.", "Enter the page range you need, such as 1-3, 5.", "Extract and download a new PDF with those pages."]} faqs={[["Are my PDFs uploaded?", "No. The selected pages are copied locally in your browser."], ["Can I extract non-adjacent pages?", "Yes. Enter a comma-separated list such as 1-3, 5, 8."], ["Does splitting change the original PDF?", "No. PixProMax creates a separate download and leaves your original file unchanged."]]}> <PdfTool mode="split" /> </ToolPage>;
}
