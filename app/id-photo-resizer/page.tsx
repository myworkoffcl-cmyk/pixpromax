import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `ID Photo Resizer – ${SITE_NAME}`,
  description:
    "Resize ID photos to specification. Supports driver's license, state ID, and similar documents. No upload.",
  alternates: { canonical: "/id-photo-resizer" },
};

export default function IdPhotoResizerPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>ID Photo Resizer</h1>
        <p>Prepare ID photos to official specifications.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "resize",
          resize: { enabled: true, preset: "id" },
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
