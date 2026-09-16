/**
 * Universal Image Pipeline
 *
 * One decode → crop/edit → resize → format → compress → one output.
 * Minimises lossy re-encoding by keeping everything on canvas until the
 * final export step.
 */
import picaFactory from "pica";
import { createCanvas, canvasToBlob, getContext } from "@/lib/image/canvas";
import { calculateCropRect } from "@/lib/image/crop";
import { decodeImage } from "@/lib/image/decode";
import { baseFilename, outputFilename } from "@/lib/image/filename";
import { extensionForMime } from "@/lib/image/format";
import { optimizeToTarget } from "@/lib/image/target-size";
import type { ImageMime } from "@/types/image";
import type { PipelineResult, WorkspaceOps } from "@/types/workspace";

// ─── helpers ───────────────────────────────────────────────────────────────

function buildFilter(edit: WorkspaceOps["edit"]): string {
  const parts: string[] = [];
  if (edit.brightness !== 1) parts.push(`brightness(${edit.brightness})`);
  if (edit.contrast !== 1) parts.push(`contrast(${edit.contrast})`);
  if (edit.saturation !== 1) parts.push(`saturate(${edit.saturation})`);
  if (edit.grayscale) parts.push("grayscale(1)");
  if (edit.sepia) parts.push("sepia(0.9)");
  if (edit.invert) parts.push("invert(1)");
  return parts.join(" ");
}

function releaseCanvas(c: HTMLCanvasElement) {
  c.width = 1;
  c.height = 1;
}

// ─── main pipeline ─────────────────────────────────────────────────────────

export async function runPipeline(
  source: File,
  ops: WorkspaceOps
): Promise<PipelineResult> {
  const decoded = await decodeImage(source);
  try {
    let srcW = decoded.width;
    let srcH = decoded.height;

    // ── 1. Determine output MIME ──────────────────────────────────────────
    const isValidMime = (s: string): s is ImageMime =>
      s === "image/jpeg" || s === "image/png" || s === "image/webp";
    const outputMime: ImageMime = ops.convert.enabled && isValidMime(ops.convert.format)
      ? ops.convert.format
      : isValidMime(source.type)
      ? (source.type as ImageMime)
      : "image/jpeg";

    // ── 2. Crop ───────────────────────────────────────────────────────────
    let workW = srcW;
    let workH = srcH;
    let cropCanvas = createCanvas({ width: srcW, height: srcH });
    let cropCtx = getContext(cropCanvas);
    // If editing with a crop selection, apply it; otherwise full frame
    const cropOptions = ops.edit.enabled
      ? { aspectRatio: null, zoom: 1, offsetX: 0, offsetY: 0 } // basic: no crop selection in V1
      : null;
    cropCtx.drawImage(decoded.source, 0, 0);

    // ── 3. Rotate + Flip ──────────────────────────────────────────────────
    const rotation = ops.edit.enabled ? ops.edit.rotation : 0;
    const flipX = ops.edit.enabled ? ops.edit.flipX : false;
    const flipY = ops.edit.enabled ? ops.edit.flipY : false;
    const sideways = rotation === 90 || rotation === 270;
    const rotW = sideways ? workH : workW;
    const rotH = sideways ? workW : workH;

    let rotCanvas = createCanvas({ width: rotW, height: rotH });
    const rotCtx = getContext(rotCanvas);

    if (outputMime === "image/jpeg") {
      rotCtx.fillStyle = "#ffffff";
      rotCtx.fillRect(0, 0, rotW, rotH);
    }

    if (rotation !== 0 || flipX || flipY) {
      rotCtx.save();
      rotCtx.translate(rotW / 2, rotH / 2);
      rotCtx.rotate((rotation * Math.PI) / 180);
      rotCtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      rotCtx.drawImage(cropCanvas, -workW / 2, -workH / 2);
      rotCtx.restore();
    } else {
      rotCtx.drawImage(cropCanvas, 0, 0);
    }
    releaseCanvas(cropCanvas);

    // ── 4. Color adjustments ──────────────────────────────────────────────
    let adjustedCanvas = rotCanvas;
    if (ops.edit.enabled) {
      const filter = buildFilter(ops.edit);
      if (filter) {
        adjustedCanvas = createCanvas({ width: rotW, height: rotH });
        const adjCtx = getContext(adjustedCanvas);
        adjCtx.filter = filter;
        adjCtx.drawImage(rotCanvas, 0, 0);
        releaseCanvas(rotCanvas);
      }
    }

    // ── 5. Resize ─────────────────────────────────────────────────────────
    let finalW = rotW;
    let finalH = rotH;

    if (ops.resize.enabled) {
      if (ops.resize.mode === "percent") {
        finalW = Math.max(1, Math.round(rotW * ops.resize.percent / 100));
        finalH = Math.max(1, Math.round(rotH * ops.resize.percent / 100));
      } else {
        finalW = ops.resize.width;
        finalH = ops.resize.height;
      }
    }

    let finalCanvas: HTMLCanvasElement;
    if (finalW === rotW && finalH === rotH) {
      finalCanvas = adjustedCanvas;
    } else {
      finalCanvas = createCanvas({ width: finalW, height: finalH });
      if (outputMime === "image/jpeg") {
        const fCtx = getContext(finalCanvas);
        fCtx.fillStyle = "#ffffff";
        fCtx.fillRect(0, 0, finalW, finalH);
      }
      await picaFactory().resize(adjustedCanvas, finalCanvas, { quality: 3 });
      releaseCanvas(adjustedCanvas);
    }

    // ── 6. Export (compress or plain encode) ─────────────────────────────
    const base = baseFilename(source.name);
    const ext = extensionForMime(outputMime);

    let blob: Blob;
    let resultFilename: string;

    if (ops.compress.enabled) {
      if (ops.compress.mode === "target") {
        // For target-size we create a temporary file from the current canvas
        // and run the iterative optimizer on it.
        const intermediateBlob = await canvasToBlob(finalCanvas, outputMime, 0.92);
        releaseCanvas(finalCanvas);
        const intermediateFile = new File([intermediateBlob], `${base}.${ext}`, { type: outputMime });
        const targetResult = await optimizeToTarget(
          intermediateFile,
          ops.compress.targetKb * 1024,
          { width: finalW, height: finalH },
          outputMime
        );
        blob = targetResult.blob;
        resultFilename = `${base}-${ops.compress.targetKb}kb.${ext}`;
      } else {
        blob = await canvasToBlob(finalCanvas, outputMime, ops.compress.quality);
        releaseCanvas(finalCanvas);
        resultFilename = `${base}-compressed.${ext}`;
      }
    } else {
      // Default quality per format
      const quality = outputMime === "image/png" ? 1 : 0.90;
      blob = await canvasToBlob(finalCanvas, outputMime, quality);
      releaseCanvas(finalCanvas);

      const suffix = [
        ops.convert.enabled ? "converted" : null,
        ops.resize.enabled ? "resized" : null,
        ops.edit.enabled && (ops.edit.rotation || ops.edit.flipX || ops.edit.flipY) ? "edited" : null,
      ].filter(Boolean).join("-") || "output";
      resultFilename = `${base}-${suffix}.${ext}`;
    }

    return { blob, width: finalW, height: finalH, mime: outputMime, filename: resultFilename };
  } finally {
    decoded.dispose();
  }
}
