import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Resize Image Online – ${SITE_NAME}`,
  description:
    "Resize photos with precise dimensions, useful presets, and aspect-ratio control. No upload, no account needed.",
  alternates: { canonical: "/resize-image" },
};

export default function ResizeImagePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Resize Image</h1>
        <p>Resize photos with precise dimensions, useful presets, and aspect-ratio control.</p>
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
