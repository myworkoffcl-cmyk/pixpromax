import type { Metadata } from "next";
import { PassportTool } from "@/components/tools/passport-tool";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("passport-photo-maker")!;
export const metadata: Metadata = toolMetadata(tool);

export default function PassportPhotoPage() {
  return <ToolPage tool={tool} steps={["Upload a clear portrait and select a convenient size preset.", "Use zoom and position controls to frame the head and shoulders inside the guide.", "Export a high-quality JPEG, then verify it against the current official document requirements."]} faqs={[["Are these presets accepted everywhere?", "No. Photo rules change by country and document. Always confirm current dimensions, background, head position, and recency rules with the issuing authority."], ["What resolution is exported?", "Physical presets are converted at 300 DPI; the custom preset uses your chosen pixel dimensions."], ["Does this tool change the background?", "No. This MVP crops and resizes the portrait. Use a photo with a suitable plain background."]]}> <PassportTool /> </ToolPage>;
}
