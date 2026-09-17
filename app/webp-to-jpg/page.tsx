import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `WebP to JPG Converter – ${SITE_NAME}`,
  description:
    "Convert WebP images to JPG format. Restore compatibility with older systems. No upload, fast, free.",
  alternates: { canonical: "/webp-to-jpg" },
};

export default function WebpToJpgPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>WebP to JPG</h1>
        <p>Convert WebP images to JPG format for universal compatibility.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "convert",
          convert: { enabled: true, format: "image/jpeg" },
        }}
      />
    </main>
  );
}
