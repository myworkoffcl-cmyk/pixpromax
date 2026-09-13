import type { Metadata } from "next";
import { SITE_NAME } from "@/config/site";
import type { ToolConfig } from "@/types/tool";

const seoTitles: Record<string, string> = {
  "compress-image": "Compress Image Online Free",
  "resize-image": "Resize Image Online Free",
  "convert-image": "Convert PNG, JPG & WebP Online",
  "batch-converter": "Batch Image Converter Online",
  "resize-image-to-kb": "Resize Image to 20KB, 50KB or 100KB",
  "passport-photo-maker": "Passport Photo Maker Online",
  "crop-image": "Crop and Rotate Image Online",
  "image-to-pdf": "Convert Images to PDF Online",
  "signature-resizer": "Signature Resizer for Online Forms",
};

export function toolMetadata(tool: ToolConfig): Metadata {
  const title = seoTitles[tool.slug] ?? tool.name;
  const url = `/${tool.slug}`;
  return {
    title,
    description: tool.longDescription,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description: tool.longDescription, url },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description: tool.longDescription },
  };
}
