import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Pixelate / Censor Image – ${SITE_NAME}`,
  description:
    "Pixelate or censor images to hide sensitive content. Adjustable pixelation. No upload, instant, free.",
  alternates: { canonical: "/pixelate-image" },
};

export default function PixelateImagePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Pixelate Image</h1>
        <p>Pixelate or censor parts of images for privacy.</p>
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
