import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Bulk Image Resizer – ${SITE_NAME}`,
  description:
    "Resize multiple images at once. Set dimensions or scale by percentage. Download as ZIP. No upload, instant, free.",
  alternates: { canonical: "/bulk-image-resizer" },
};

export default function BulkImageResizerPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Bulk Image Resizer</h1>
        <p>Resize multiple images at once and download as ZIP.</p>
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
