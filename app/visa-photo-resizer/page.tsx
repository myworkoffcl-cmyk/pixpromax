import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Visa Photo Resizer – ${SITE_NAME}`,
  description:
    "Resize and prepare visa photos. Supports most visa requirements. Crop, compress, download. No upload.",
  alternates: { canonical: "/visa-photo-resizer" },
};

export default function VisaPhotoResizerPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Visa Photo Resizer</h1>
        <p>Prepare visa photos to specification.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "resize",
          resize: { enabled: true, preset: "visa" },
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
