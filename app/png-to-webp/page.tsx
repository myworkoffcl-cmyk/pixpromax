import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `PNG to WebP Converter – ${SITE_NAME}`,
  description:
    "Convert PNG to WebP format for smaller file sizes. WebP offers better compression than PNG. No upload, free.",
  alternates: { canonical: "/png-to-webp" },
};

export default function PngToWebpPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>PNG to WebP</h1>
        <p>Convert PNG images to WebP format for optimal compression.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "convert",
          convert: { enabled: true, format: "image/webp" },
        }}
      />
    </main>
  );
}
