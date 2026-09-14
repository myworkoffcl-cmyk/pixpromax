import type { Metadata } from "next";
import { ImageToPdfTool } from "@/components/tools/image-to-pdf-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("jpg-to-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function JpgToPdfPage() {
  return <ToolPage tool={tool} fileLabel="images" steps={["Choose up to 20 JPG, PNG, or WebP images and arrange their order.", "Select A4, US Letter, or image-fit pages with orientation and margin controls.", "Create and download one PDF directly from your browser."]} faqs={[["Are my images uploaded?", "No. The images are decoded and assembled into the PDF on your device."], ["Can I combine multiple images?", "Yes. Add up to 20 images, reorder them, and create one multi-page PDF."], ["Which page sizes are available?", "Choose A4, US Letter, or Fit each image. A4 and Letter support portrait or landscape orientation and adjustable margins."]]}> <ImageToPdfTool /> </ToolPage>;
}
