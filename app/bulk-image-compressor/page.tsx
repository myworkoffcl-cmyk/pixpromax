import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Bulk Image Compressor – ${SITE_NAME}`,
  description:
    "Compress multiple images at once. Batch process up to 20 images. Download as ZIP. No upload, instant, free.",
  alternates: { canonical: "/bulk-image-compressor" },
};

export default function BulkImageCompressorPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Bulk Image Compressor</h1>
        <p>Compress multiple images at once and download as ZIP.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "compress",
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
