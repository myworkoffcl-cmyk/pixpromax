import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Signature Resizer – ${SITE_NAME}`,
  description:
    "Resize signature images to application requirements. Compress and prepare for submission. No upload, instant.",
  alternates: { canonical: "/signature-resizer" },
};

export default function SignatureResizerPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Signature Resizer</h1>
        <p>Prepare signature images to meet application requirements.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "resize",
          resize: { enabled: true, preset: "signature" },
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
