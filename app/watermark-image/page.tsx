import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Add Watermark to Image – ${SITE_NAME}`,
  description:
    "Add text or logo watermarks to images. Adjustable opacity, position, and size. No upload, instant, free.",
  alternates: { canonical: "/watermark-image" },
};

export default function WatermarkImagePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Watermark Image</h1>
        <p>Add text or image watermarks to protect your photos.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "edit",
          edit: { enabled: true },
        }}
      />
    </main>
  );
}
