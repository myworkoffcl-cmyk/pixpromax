import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Resize Images Online – ${SITE_NAME}`,
  description:
    "Resize images by pixel dimensions or percentage. Lock aspect ratio or set exact width and height. Supports JPG, PNG, and WebP.",
  alternates: { canonical: "/image-tools/resize" },
};

export default function ResizeCategoryPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Resize Images</h1>
        <p>Scale by percentage or set exact pixel dimensions. Lock the aspect ratio to avoid distortion.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "resize",
          resize: { enabled: true },
        }}
      />
    </main>
  );
}
