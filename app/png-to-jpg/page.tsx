import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `PNG to JPG Converter – ${SITE_NAME}`,
  description:
    "Convert PNG images to JPG format online. Reduce file size while maintaining quality. Fast, free, no upload.",
  alternates: { canonical: "/png-to-jpg" },
};

export default function PngToJpgPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>PNG to JPG</h1>
        <p>Convert PNG images to JPG format and reduce file size.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "convert",
          convert: { enabled: true, format: "image/jpeg" },
        }}
      />
    </main>
  );
}
