import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Passport Photo Resizer – ${SITE_NAME}`,
  description:
    "Resize and prepare passport photos. Supports international requirements (35x45mm, 4x6 inches, etc). No upload.",
  alternates: { canonical: "/passport-photo-resizer" },
};

export default function PassportPhotoResizerPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Passport Photo Resizer</h1>
        <p>Prepare passport photos to official specifications.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "resize",
          resize: { enabled: true, preset: "passport" },
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
