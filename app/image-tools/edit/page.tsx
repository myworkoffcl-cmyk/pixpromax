import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Edit Images Online – ${SITE_NAME}`,
  description:
    "Rotate, flip, adjust brightness, contrast, saturation and apply filters. Edit images in your browser — no upload required.",
  alternates: { canonical: "/image-tools/edit" },
};

export default function EditCategoryPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Edit Images</h1>
        <p>Rotate, flip, and apply color adjustments. Everything happens in your browser.</p>
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
