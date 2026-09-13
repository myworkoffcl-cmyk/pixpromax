import type { Metadata } from "next";
import { TargetSizeTool } from "@/components/tools/target-size-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("resize-image-to-kb")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ResizeToKbPage() {
  return <ToolPage tool={tool} steps={["Upload an image and choose 20 KB, 50 KB, 100 KB, 200 KB, or a custom target.", "PixProMax runs a bounded quality search and only reduces dimensions when quality alone is not enough.", "Review the actual size, difference, dimensions, and quality before downloading."]} faqs={[["Can the result be exactly 50 KB?", "Not always. Image encoders produce discrete byte sizes, so PixProMax returns the closest practical result rather than claiming an impossible guarantee."], ["Will the dimensions change?", "Only when lowering encoding quality is not enough to approach the target. Dimension reduction is progressive and bounded."], ["Why does a very small target look softer?", "Fewer bytes can store less image detail. Larger originals and complex photos require stronger optimization for tiny targets."]]}> <TargetSizeTool /> </ToolPage>;
}
