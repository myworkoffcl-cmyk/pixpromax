import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `JPG to PNG Converter – ${SITE_NAME}`,
  description:
    "Convert JPG images to PNG format online. Preserve transparency support and lossless quality. Fast, free, no upload.",
  alternates: { canonical: "/jpg-to-png" },
};

export default function JpgToPngPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>JPG to PNG</h1>
        <p>Convert JPG images to PNG format with full quality preservation.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "convert",
          convert: { enabled: true, format: "image/png" },
        }}
      />
    </main>
  );
}
