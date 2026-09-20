/**
 * Universal Image Pipeline
 *
 * Order: decode → crop → rotate/flip → colour-adjust → enhance →
 *        resize → canvas-extend → overlay → export/compress
 *
 * One decode, one output — no repeated lossy re-encodes.
 */
import picaFactory from "pica";
import { createCanvas, canvasToBlob, getContext } from "@/lib/image/canvas";
import { decodeImage } from "@/lib/image/decode";
import { baseFilename, outputFilename } from "@/lib/image/filename";
import { extensionForMime } from "@/lib/image/format";
import { optimizeToTarget } from "@/lib/image/target-size";
import type { PipelineResult, WorkspaceOps, CropAspect, OverlayPosition } from "@/types/workspace";

// ─── helpers ───────────────────────────────────────────────────────────────

function releaseCanvas(c: HTMLCanvasElement) {
  c.width = 1;
  c.height = 1;
}

function buildColorFilter(edit: WorkspaceOps["edit"]): string {
  const parts: string[] = [];
  if (edit.brightness !== 1) parts.push(`brightness(${edit.brightness})`);
  if (edit.contrast !== 1) parts.push(`contrast(${edit.contrast})`);
  if (edit.saturation !== 1) parts.push(`saturate(${edit.saturation})`);
  if (edit.grayscale) parts.push("grayscale(1)");
  if (edit.sepia) parts.push("sepia(0.9)");
  if (edit.invert) parts.push("invert(1)");
  return parts.join(" ");
}

/** Draw a rounded-rectangle clipping path (no built-in `roundRect` needed). */
function clipRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const rr = Math.min(r, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/** Apply a 3×3 sharpening convolution kernel (unsharp mask). */
function applySharpen(src: HTMLCanvasElement): HTMLCanvasElement {
  const w = src.width;
  const h = src.height;
  // Skip pixel manipulation on very large images for performance
  if (w * h > 4_000_000) return src;

  const srcCtx = getContext(src);
  const srcData = srcCtx.getImageData(0, 0, w, h).data;

  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const result = new Uint8ClampedArray(srcData.length);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ny = Math.max(0, Math.min(h - 1, y + ky));
            const nx = Math.max(0, Math.min(w - 1, x + kx));
            sum += srcData[(ny * w + nx) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        result[i + c] = Math.max(0, Math.min(255, sum));
      }
      result[i + 3] = srcData[i + 3]; // preserve alpha
    }
  }

  const out = createCanvas({ width: w, height: h });
  const outCtx = getContext(out);
  outCtx.putImageData(new ImageData(result, w, h), 0, 0);
  return out;
}

/** Resolve overlay position to pixel coordinates. */
function overlayXY(
  position: OverlayPosition,
  canvasW: number, canvasH: number,
  itemW: number, itemH: number,
  margin: number
): [number, number] {
  if (position === "center") {
    return [(canvasW - itemW) / 2, (canvasH - itemH) / 2];
  }
  const [vy, vx] = [position[0], position[1]]; // t/b, l/c/r
  const x =
    vx === "l" ? margin
    : vx === "r" ? canvasW - itemW - margin
    : (canvasW - itemW) / 2;
  const y =
    vy === "t" ? margin
    : vy === "b" ? canvasH - itemH - margin
    : (canvasH - itemH) / 2;
  return [x, y];
}

// ─── main pipeline ─────────────────────────────────────────────────────────

export async function runPipeline(
  source: File,
  ops: WorkspaceOps
): Promise<PipelineResult> {
  const decoded = await decodeImage(source);
  try {
    const srcW = decoded.width;
    const srcH = decoded.height;

    // ── 1. Output MIME ────────────────────────────────────────────────────
    const validMimes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    const outputMime: string =
      ops.convert.enabled && validMimes.has(ops.convert.format)
        ? ops.convert.format
        : validMimes.has(source.type)
        ? source.type
        : "image/jpeg";

    // ── 2. Crop ───────────────────────────────────────────────────────────
    const edit = ops.edit;
    let cropX = 0, cropY = 0, cropW = srcW, cropH = srcH;
    if (edit.enabled && edit.crop.enabled) {
      cropX = Math.round(edit.crop.x * srcW);
      cropY = Math.round(edit.crop.y * srcH);
      cropW = Math.max(1, Math.round(edit.crop.w * srcW));
      cropH = Math.max(1, Math.round(edit.crop.h * srcH));
      cropX = Math.max(0, Math.min(cropX, srcW - cropW));
      cropY = Math.max(0, Math.min(cropY, srcH - cropH));
    }

    let workCanvas = createCanvas({ width: cropW, height: cropH });
    let workCtx = getContext(workCanvas);
    workCtx.drawImage(decoded.source, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    let workW = cropW;
    let workH = cropH;

    // ── 3. Rotate + Flip ──────────────────────────────────────────────────
    const rotation = edit.enabled ? edit.rotation : 0;
    const flipX = edit.enabled ? edit.flipX : false;
    const flipY = edit.enabled ? edit.flipY : false;
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
      rotCtx.drawImage(workCanvas, -workW / 2, -workH / 2);
      rotCtx.restore();
    } else {
      rotCtx.drawImage(workCanvas, 0, 0);
    }
    releaseCanvas(workCanvas);

    // ── 4. Colour adjustments ─────────────────────────────────────────────
    let adjustedCanvas = rotCanvas;
    if (edit.enabled) {
      const filter = buildColorFilter(edit);
      if (filter) {
        adjustedCanvas = createCanvas({ width: rotW, height: rotH });
        const adjCtx = getContext(adjustedCanvas);
        adjCtx.filter = filter;
        adjCtx.drawImage(rotCanvas, 0, 0);
        releaseCanvas(rotCanvas);
      }
    }

    // ── 5. Enhance (blur / pixelate / sharpen) ────────────────────────────
    let enhancedCanvas = adjustedCanvas;
    if (edit.enabled) {
      const { blur, pixelate, sharpen } = edit;

      if (pixelate > 1) {
        const blockSize = Math.round(pixelate);
        const smallW = Math.max(1, Math.round(rotW / blockSize));
        const smallH = Math.max(1, Math.round(rotH / blockSize));
        const smallCanvas = createCanvas({ width: smallW, height: smallH });
        const smallCtx = getContext(smallCanvas);
        smallCtx.imageSmoothingEnabled = true;
        smallCtx.drawImage(adjustedCanvas, 0, 0, smallW, smallH);

        const pixCanvas = createCanvas({ width: rotW, height: rotH });
        const pixCtx = getContext(pixCanvas);
        pixCtx.imageSmoothingEnabled = false;
        pixCtx.drawImage(smallCanvas, 0, 0, rotW, rotH);
        releaseCanvas(smallCanvas);
        if (enhancedCanvas !== adjustedCanvas) releaseCanvas(enhancedCanvas);
        releaseCanvas(adjustedCanvas);
        enhancedCanvas = pixCanvas;
        adjustedCanvas = pixCanvas;
      }

      if (blur > 0) {
        const blurCanvas = createCanvas({ width: rotW, height: rotH });
        const blurCtx = getContext(blurCanvas);
        blurCtx.filter = `blur(${blur}px)`;
        blurCtx.drawImage(enhancedCanvas, 0, 0);
        if (blurCanvas !== enhancedCanvas) releaseCanvas(enhancedCanvas);
        enhancedCanvas = blurCanvas;
      }

      if (sharpen && blur === 0 && pixelate <= 1) {
        const sharpened = applySharpen(enhancedCanvas);
        if (sharpened !== enhancedCanvas) {
          releaseCanvas(enhancedCanvas);
          enhancedCanvas = sharpened;
        }
      }
    }

    // ── 6. Resize ─────────────────────────────────────────────────────────
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
      finalCanvas = enhancedCanvas;
    } else {
      finalCanvas = createCanvas({ width: finalW, height: finalH });
      if (outputMime === "image/jpeg") {
        const fCtx = getContext(finalCanvas);
        fCtx.fillStyle = "#ffffff";
        fCtx.fillRect(0, 0, finalW, finalH);
      }
      await picaFactory().resize(enhancedCanvas, finalCanvas, { quality: 3 });
      releaseCanvas(enhancedCanvas);
    }

    // ── 7. Border radius (clip) ───────────────────────────────────────────
    if (edit.enabled && edit.borderRadius > 0) {
      const r = edit.borderRadius;
      const radCanvas = createCanvas({ width: finalW, height: finalH });
      const radCtx = getContext(radCanvas);

      if (outputMime === "image/jpeg") {
        radCtx.fillStyle = edit.paddingColor || "#ffffff";
        radCtx.fillRect(0, 0, finalW, finalH);
      }

      clipRoundedRect(radCtx, 0, 0, finalW, finalH, r);
      radCtx.clip();
      radCtx.drawImage(finalCanvas, 0, 0);
      releaseCanvas(finalCanvas);
      finalCanvas = radCanvas;
    }

    // ── 8. Canvas extension (padding + border) ────────────────────────────
    if (edit.enabled && (edit.padding > 0 || edit.border > 0)) {
      const pad = Math.max(0, edit.padding);
      const bw = Math.max(0, edit.border);
      const total = pad + bw;
      const newW = finalW + total * 2;
      const newH = finalH + total * 2;

      const extCanvas = createCanvas({ width: newW, height: newH });
      const extCtx = getContext(extCanvas);

      // Background / padding fill
      extCtx.fillStyle = edit.paddingColor || "#ffffff";
      extCtx.fillRect(0, 0, newW, newH);

      // Image centered inside padding
      extCtx.drawImage(finalCanvas, total, total);

      // Border drawn around image (inside padding zone)
      if (bw > 0) {
        extCtx.strokeStyle = edit.borderColor || "#000000";
        extCtx.lineWidth = bw;
        extCtx.strokeRect(pad + bw / 2, pad + bw / 2, finalW + bw, finalH + bw);
      }

      releaseCanvas(finalCanvas);
      finalCanvas = extCanvas;
      finalW = newW;
      finalH = newH;
    }

    // ── 9. Text overlay ───────────────────────────────────────────────────
    if (edit.enabled && edit.textOverlay.enabled && edit.textOverlay.text.trim()) {
      const { text, fontSize, color, opacity, position, bold } = edit.textOverlay;
      const overlayCtx = getContext(finalCanvas);
      const margin = Math.round(Math.max(12, fontSize * 0.5));

      overlayCtx.save();
      overlayCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
      overlayCtx.font = `${bold ? "bold " : ""}${fontSize}px sans-serif`;
      overlayCtx.fillStyle = color;
      overlayCtx.shadowColor = "rgba(0,0,0,0.55)";
      overlayCtx.shadowBlur = Math.round(fontSize * 0.15);
      overlayCtx.shadowOffsetX = 1;
      overlayCtx.shadowOffsetY = 1;
      overlayCtx.textBaseline = "middle";

      const textW = overlayCtx.measureText(text).width;
      const textH = fontSize;
      const [tx, ty] = overlayXY(position, finalW, finalH, textW, textH, margin);
      overlayCtx.fillText(text, tx, ty + textH / 2);
      overlayCtx.restore();
    }

    // ── 10. Image overlay (watermark / logo) ─────────────────────────────
    if (edit.enabled && edit.imageOverlay.enabled && edit.imageOverlay.dataUrl) {
      const overlayImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = edit.imageOverlay.dataUrl!;
      });

      const { position, scale, opacity } = edit.imageOverlay;
      const overlayW = Math.max(1, Math.round(finalW * Math.max(0.05, Math.min(0.9, scale))));
      const overlayH = Math.round(overlayImg.height * (overlayW / overlayImg.width));
      const margin = Math.round(finalW * 0.03);
      const [ox, oy] = overlayXY(position, finalW, finalH, overlayW, overlayH, margin);

      const overlayCtx = getContext(finalCanvas);
      overlayCtx.save();
      overlayCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
      overlayCtx.drawImage(overlayImg, ox, oy, overlayW, overlayH);
      overlayCtx.restore();
    }

    // ── 11. Export (compress or plain encode) ─────────────────────────────
    const base = baseFilename(source.name);
    const ext = extensionForMime(outputMime);

    let blob: Blob;
    let resultFilename: string;

    if (ops.compress.enabled) {
      if (ops.compress.mode === "target") {
        const intermediateBlob = await canvasToBlob(finalCanvas, outputMime as import("@/types/image").ImageMime, 0.92);
        releaseCanvas(finalCanvas);
        const intermediateFile = new File([intermediateBlob], `${base}.${ext}`, { type: outputMime });
        const targetResult = await optimizeToTarget(
          intermediateFile,
          ops.compress.targetKb * 1024,
          { width: finalW, height: finalH },
          outputMime as import("@/types/image").ImageMime
        );
        blob = targetResult.blob;
        resultFilename = `${base}-${ops.compress.targetKb}kb.${ext}`;
      } else {
        blob = await canvasToBlob(finalCanvas, outputMime as import("@/types/image").ImageMime, ops.compress.quality);
        releaseCanvas(finalCanvas);
        resultFilename = `${base}-compressed.${ext}`;
      }
    } else {
      const quality = outputMime === "image/png" ? 1 : 0.90;
      blob = await canvasToBlob(finalCanvas, outputMime as import("@/types/image").ImageMime, quality);
      releaseCanvas(finalCanvas);

      const suffix = [
        ops.convert.enabled ? "converted" : null,
        ops.resize.enabled ? "resized" : null,
        edit.enabled ? "edited" : null,
      ].filter(Boolean).join("-") || "output";
      resultFilename = `${base}-${suffix}.${ext}`;
    }

    return { blob, width: finalW, height: finalH, mime: outputMime, filename: resultFilename };
  } finally {
    decoded.dispose();
  }
}
