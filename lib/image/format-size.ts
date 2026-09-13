export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

export function formatPercentSaved(before: number, after: number): string {
  if (before <= 0) return "0%";
  return `${Math.max(0, Math.round((1 - after / before) * 100))}%`;
}
