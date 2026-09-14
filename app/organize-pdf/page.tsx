import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("organize-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function OrganizePdfPage() {
  return <ToolPage tool={tool} fileLabel="PDF" steps={["Choose one PDF from your device.", "Enter the pages in the order you want to keep.", "Download the reorganized PDF."]} faqs={[["Are my PDFs uploaded?", "No. The new PDF is assembled locally in your browser."], ["How do I remove a page?", "Leave it out of the page-order field. For example, 1, 3, 4 removes page 2."], ["Can I duplicate a page?", "Yes. Enter it more than once, such as 1, 2, 1."]]}> <PdfTool mode="organize" /> </ToolPage>;
}
