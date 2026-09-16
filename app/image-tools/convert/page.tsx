import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Convert Images Online – ${SITE_NAME}`,
  description:
    "Convert images between JPG, PNG, and WebP formats in your browser. No upload required. Fast and private.",
  alternates: { canonical: "/image-tools/convert" },
};

export default function ConvertCategoryPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>Convert Images</h1>
        <p>Switch between JPG, PNG and WebP. Combine with resize or compress in one pass.</p>
      </div>
      <UniversalWorkspace
        init={{
          initialEngine: "convert",
          convert: { enabled: true },
        }}
      />
    </main>
  );
}
