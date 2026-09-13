import type { Metadata } from "next";
import { CropTool } from "@/components/tools/crop-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("crop-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function CropImagePage() {
  return <ToolPage tool={tool} steps={["Upload a JPG, PNG, or WebP image.", "Choose an aspect ratio, then adjust zoom, position, rotation, or flips.", "Review the exact output dimensions and download the cropped image."]} faqs={[["Does cropping reduce image quality?", "PixProMax crops from the original pixels. JPG and WebP are re-encoded at high quality; PNG remains lossless."], ["Can I keep the original aspect ratio?", "Yes. Choose Free to preserve the available aspect, or select Square, 4:3, 16:9, or 3:4."], ["Is the image uploaded?", "No. Cropping, rotation, and encoding happen in your browser."]]}> <CropTool /> </ToolPage>;
}
