import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `WebP to PNG Converter – ${SITE_NAME}`,
  description:
    "Convert WebP images to PNG format. Preserve transparency and lossless quality. No upload, fast, free.",
  alternates: { canonical: "/webp-to-png" },
};

export default function WebpToPngPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>WebP to PNG</h1>
        <p>Convert WebP images to PNG format with full quality preservation.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "convert",
          convert: { enabled: true, format: "image/png" },
        }}
      />
    </main>
  );
}
