"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Minimize2,
  Maximize2,
  SlidersHorizontal,
  RefreshCw,
  Upload,
} from "lucide-react";
import Link from "@/components/site-link";
import { useTranslation } from "@/lib/use-translation";

export function WorkspaceEntry() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useTranslation("common");

  const engines = [
    {
      href: "/image-tools/compress",
      label: t("tools.compress-image", "Compress Image"),
      icon: Minimize2,
      detail: t("workspace.compressDetail", "Shrink JPG, PNG, and WebP files without a watermark."),
      accent: "mint",
    },
    {
      href: "/image-tools/resize",
      label: t("tools.resize-image", "Resize Image"),
      icon: Maximize2,
      detail: t("workspace.resizeDetail", "Set exact dimensions or scale by percentage."),
      accent: "violet",
    },
    {
      href: "/image-tools/edit",
      label: t("workspace.edit", "Edit"),
      icon: SlidersHorizontal,
      detail: t("workspace.editDetail", "Crop, rotate, and flip an image with precise aspect ratios."),
      accent: "cyan",
    },
    {
      href: "/image-tools/convert",
      label: t("tools.convert-image", "Convert Image"),
      icon: RefreshCw,
      detail: t("workspace.convertDetail", "Convert HEIC, AVIF, PNG, JPG, and WebP locally."),
      accent: "sky",
    },
  ];

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Store File object in IndexedDB for workspace pickup (privacy-first)
    const { savePendingImage } = await import("@/lib/workspace/store");
    try {
      await savePendingImage(file);
    } catch (_) {
      // IndexedDB unavailable – navigate anyway, workspace shows upload UI
    }
    router.push("/workspace");
  }

  return (
    <section className="workspace-entry shell" aria-label="Image workspace">
      <div className="workspace-entry-inner">
        <div className="workspace-entry-hero">
          <h2 className="workspace-entry-title">
            {t("workspace.title", "One workspace.")}<br />
            <em>{t("workspace.subtitle", "All your image tools.")}</em>
          </h2>
          <p className="workspace-entry-sub">
            {t("workspace.description", "Compress, resize, edit and convert in a single pass — no repeated uploads.")}
          </p>
          <button
            className="workspace-entry-upload"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <Upload aria-hidden="true" />
            {t("workspace.upload", "Upload an image")}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFile}
            aria-label="Upload image to workspace"
          />
        </div>

        <div className="workspace-entry-engines" role="list">
          {engines.map(({ href, label, icon: Icon, detail, accent }) => (
            <Link
              href={href}
              key={href}
              className={`workspace-engine-tile accent-${accent}`}
              role="listitem"
            >
              <span className="engine-tile-icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="engine-tile-text">
                <span className="engine-tile-label">{label}</span>
                <span className="engine-tile-detail">{detail}</span>
              </span>
              <ArrowUpRight className="engine-tile-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
