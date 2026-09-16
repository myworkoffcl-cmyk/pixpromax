import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Compress Images Online – ${SITE_NAME}`,
  description:
    "Reduce image file size without losing quality. Adjust quality manually or hit a target KB. Supports JPG, PNG, and WebP.",
  alternates: { canonical: "/image-tools/compress" },
};

export default function CompressCategoryPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Compress Images</h1>
        <p>Reduce file size while keeping quality. Set a quality level or target a specific KB.</p>
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
