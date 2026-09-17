import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Blur Image Online – ${SITE_NAME}`,
  description:
    "Blur images for privacy or artistic effect. Adjustable blur strength. No upload, instant, free.",
  alternates: { canonical: "/blur-image" },
};

export default function BlurImagePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Blur Image</h1>
        <p>Apply blur effects to images with adjustable strength.</p>
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
