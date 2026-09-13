import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/convert-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("convert-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ConvertImagePage() {
  return <ToolPage tool={tool} steps={["Select a JPG, PNG, WebP, AVIF, HEIC, or HEIF image.", "HEIC files are decoded on your device; choose JPG, PNG, or WebP output and set quality.", "For JPEG, choose a background for transparent areas, then convert and download."]} faqs={[["Can I convert an iPhone HEIC photo?", "Yes. HEIC and HEIF files are decoded locally in your browser, then converted to JPG, PNG, or WebP."], ["What happens to transparency in JPEG?", "JPEG cannot store transparency. PixProMax fills transparent areas with the background color you choose."], ["Can I convert without losing quality?", "PNG output is lossless, while JPG and WebP quality controls trade some encoded detail for a smaller file."]]}> <ConvertTool /> </ToolPage>;
}
