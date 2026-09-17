import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Add Text to Image – ${SITE_NAME}`,
  description:
    "Add text overlays to images. Customize font, size, color, and position. No upload, instant, free.",
  alternates: { canonical: "/add-text-to-image" },
};

export default function AddTextToImagePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Add Text to Image</h1>
        <p>Add text overlays to your images with full customization.</p>
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
