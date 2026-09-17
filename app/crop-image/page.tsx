import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Crop Image Online – ${SITE_NAME}`,
  description:
    "Crop images to any aspect ratio. Freeform, square, 16:9, 4:3, and more. Adjust zoom and position. No upload.",
  alternates: { canonical: "/crop-image" },
};

export default function CropImagePage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Crop Image</h1>
        <p>Crop images to any aspect ratio with precise control.</p>
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
