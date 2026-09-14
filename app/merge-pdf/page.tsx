import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("merge-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function MergePdfPage() {
  return <ToolPage tool={tool} fileLabel="PDFs" steps={["Choose PDFs from your device.", "Move each file up or down until the order is right.", "Merge and download the combined PDF."]} faqs={[["Are my PDFs uploaded?", "No. Your documents are combined in your browser."], ["Can I change the order?", "Yes. Use the arrow controls next to each file before merging."], ["Can I merge password-protected PDFs?", "Usually no. Remove the password in an authorized PDF app first, then try again."]]}> <PdfTool mode="merge" /> </ToolPage>;
}
