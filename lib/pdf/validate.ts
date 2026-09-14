import { MAX_PDF_SIZE } from "@/config/limits";

export function validatePdfFile(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return "Choose a PDF file.";
  if (!file.size) return "This PDF is empty.";
  if (file.size > MAX_PDF_SIZE) return "Choose a PDF smaller than 100 MB.";
  return null;
}

export function parsePageList(value: string, pageCount: number) {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return null;
  const values = parts.flatMap((part) => {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return [];
    const first = Number(match[1]);
    const last = Number(match[2] ?? match[1]);
    if (first < 1 || last < first || last > pageCount) return [];
    return Array.from({ length: last - first + 1 }, (_, index) => first + index);
  });
  return values.length && values.length === parts.reduce((count, part) => {
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return -Infinity;
    const first = Number(match[1]);
    const last = Number(match[2] ?? match[1]);
    return first < 1 || last < first || last > pageCount ? -Infinity : count + last - first + 1;
  }, 0) ? values : null;
}
