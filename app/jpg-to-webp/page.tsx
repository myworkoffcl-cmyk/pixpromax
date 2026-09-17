import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `JPG to WebP Converter – ${SITE_NAME}`,
  description:
    "Convert JPG to WebP format for smaller file sizes and better web performance. No upload, fast, free.",
  alternates: { canonical: "/jpg-to-webp" },
};

export default function JpgToWebpPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>JPG to WebP</h1>
        <p>Convert JPG images to WebP format for optimized web delivery.</p>
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
