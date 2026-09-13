import type { Metadata } from "next";
import { ResizeTool } from "@/components/tools/resize-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("resize-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ResizeImagePage() {
  return <ToolPage tool={tool} steps={["Upload a supported image and review its original dimensions.", "Enter a width or height, use a preset, and keep the aspect ratio locked when needed.", "Choose an output format and quality, resize, preview, and download."]} faqs={[["Does resizing stretch my image?", "With aspect-ratio lock enabled, the matching dimension updates automatically to prevent distortion."], ["Why is there a maximum image size?", "Browsers have memory and canvas limits. PixProMax rejects unreasonable dimensions before they can freeze the page."], ["Which format is smallest?", "WebP is often a good balance for web images, while PNG is useful when you need lossless detail or transparency."]]}> <ResizeTool /> </ToolPage>;
}
