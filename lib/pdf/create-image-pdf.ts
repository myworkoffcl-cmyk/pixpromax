import { imageDimensions, processImage } from "@/lib/image/process";

export type PdfPageSize = "fit" | "a4" | "letter";
export type PdfOrientation = "portrait" | "landscape";

export interface PdfOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  margin: number;
  quality: number;
}

export interface PdfImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

const encoder = new TextEncoder();
const text = (value: string) => encoder.encode(value);

function concat(parts: Uint8Array[]): Uint8Array {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

export function pageDimensions(image: PdfImage, options: PdfOptions) {
  if (options.pageSize === "fit") return { width: image.width, height: image.height };
  const base = options.pageSize === "a4" ? { width: 595.28, height: 841.89 } : { width: 612, height: 792 };
  return options.orientation === "landscape" ? { width: base.height, height: base.width } : base;
}

export async function createImagePdf(files: File[], options: PdfOptions): Promise<Blob> {
  const images: PdfImage[] = [];
  for (const file of files) {
    const dimensions = await imageDimensions(file);
    const maxSide = 2800;
    const scale = Math.min(1, maxSide / Math.max(dimensions.width, dimensions.height));
    const rendered = await processImage(file, { width: Math.max(1, Math.round(dimensions.width * scale)), height: Math.max(1, Math.round(dimensions.height * scale)), mime: "image/jpeg", quality: options.quality, background: "#ffffff", suffix: "pdf-page" });
    images.push({ bytes: new Uint8Array(await rendered.blob.arrayBuffer()), width: rendered.width, height: rendered.height });
  }

  const pageCount = images.length;
  const objectCount = 2 + pageCount * 3;
  const objects = new Map<number, Uint8Array>();
  const pageIds = images.map((_, index) => 3 + index * 3);
  objects.set(1, text("<< /Type /Catalog /Pages 2 0 R >>"));
  objects.set(2, text(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`));

  images.forEach((image, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const page = pageDimensions(image, options);
    const margin = options.pageSize === "fit" ? 0 : Math.min(options.margin, Math.min(page.width, page.height) / 3);
    const availableWidth = page.width - margin * 2;
    const availableHeight = page.height - margin * 2;
    const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const x = (page.width - drawWidth) / 2;
    const y = (page.height - drawHeight) / 2;
    const commands = `q\n${drawWidth.toFixed(3)} 0 0 ${drawHeight.toFixed(3)} ${x.toFixed(3)} ${y.toFixed(3)} cm\n/Im${index + 1} Do\nQ`;
    const commandBytes = text(commands);
    objects.set(pageId, text(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width.toFixed(3)} ${page.height.toFixed(3)}] /Resources << /XObject << /Im${index + 1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`));
    objects.set(imageId, concat([text(`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`), image.bytes, text("\nendstream")]));
    objects.set(contentId, concat([text(`<< /Length ${commandBytes.length} >>\nstream\n`), commandBytes, text("\nendstream")]));
  });

  const output: Uint8Array[] = [text("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
  const offsets = new Array<number>(objectCount + 1).fill(0);
  let cursor = output[0].length;
  for (let id = 1; id <= objectCount; id += 1) {
    offsets[id] = cursor;
    const object = concat([text(`${id} 0 obj\n`), objects.get(id)!, text("\nendobj\n")]);
    output.push(object);
    cursor += object.length;
  }
  const xrefOffset = cursor;
  const xref = [`xref\n0 ${objectCount + 1}\n`, "0000000000 65535 f \n", ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)].join("");
  output.push(text(xref));
  output.push(text(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`));
  return new Blob([concat(output) as BlobPart], { type: "application/pdf" });
}
