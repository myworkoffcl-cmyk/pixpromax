import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Compress Image to Target Size – ${SITE_NAME}`,
  description:
    "Compress images to a specific file size target (KB). Presets: 50KB, 100KB, 200KB, 500KB, or custom. No upload.",
  alternates: { canonical: "/compress-to-target-size" },
};

export default function CompressToTargetSizePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Compress to Target Size</h1>
        <p>Compress images to a specific KB target.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "compress",
          compress: { enabled: true },
        }}
      />
    </main>
  );
}
