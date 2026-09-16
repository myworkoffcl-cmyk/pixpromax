import type { Metadata } from "next";
import { UniversalWorkspace } from "@/components/workspace/workspace";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Image Workspace – ${SITE_NAME}`,
  description:
    "Compress, resize, edit and convert images in one workspace. Upload once, apply any combination of tools, download the result.",
  robots: { index: false },
};

export default function WorkspacePage() {
  return (
    <main className="workspace-page">
      <UniversalWorkspace />
    </main>
  );
}
