"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface PDFPageInfo {
  pageNumber: number;
  thumbnail?: string;
  id: string;
}

interface PDFPageSelectorProps {
  file: File;
  onSelectionChange?: (selectedPages: number[]) => void;
  mode?: "pages" | "range" | "all";
  previewPages?: number[];
  readOnly?: boolean;
}

export function PDFPageSelector({ file, onSelectionChange, mode = "pages", previewPages, readOnly = false }: PDFPageSelectorProps) {
  const [pageInfo, setPageInfo] = useState<PDFPageInfo[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeFile = async () => {
      setLoading(true);
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).href;

        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjs.getDocument({ data }).promise;

        const allPages: PDFPageInfo[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const pageId = `${pageNum}`;
          const pageData: PDFPageInfo = {
            pageNumber: pageNum,
            id: pageId,
          };

          try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext("2d");

            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
              pageData.thumbnail = canvas.toDataURL("image/png");
            }
          } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
          }

          allPages.push(pageData);
          setPageInfo([...allPages]);
        }

        if (readOnly && previewPages) {
          setSelectedPages(new Set(previewPages));
        }
      } catch (error) {
        console.error("Error analyzing PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      analyzeFile();
    }
  }, [file, readOnly, previewPages]);

  const togglePageSelection = (pageNum: number) => {
    const updated = new Set(selectedPages);
    if (updated.has(pageNum)) {
      updated.delete(pageNum);
    } else {
      updated.add(pageNum);
    }
    setSelectedPages(updated);
    onSelectionChange?.(Array.from(updated).sort((a, b) => a - b));
  };

  const selectAll = () => {
    const all = new Set(pageInfo.map(p => p.pageNumber));
    setSelectedPages(all);
    onSelectionChange?.(Array.from(all).sort((a, b) => a - b));
  };

  const clearAll = () => {
    setSelectedPages(new Set());
    onSelectionChange?.([]);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>Analyzing PDF pages...</div>
      </div>
    );
  }

  if (pageInfo.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>Could not load PDF pages</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {!readOnly && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ fontSize: "13px", color: "var(--ink)" }}>
            <strong style={{ color: "var(--ink)" }}>{selectedPages.size}</strong> of <strong>{pageInfo.length}</strong> pages selected
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={selectAll}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                border: "1px solid var(--line)",
                background: "transparent",
                borderRadius: "6px",
                cursor: "pointer",
                color: "var(--brand)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--brand), transparent 92%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                border: "1px solid var(--line)",
                background: "transparent",
                borderRadius: "6px",
                cursor: "pointer",
                color: "var(--muted)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--ink), transparent 94%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
        {pageInfo.map((page) => (
          <div
            key={page.id}
            style={{
              position: "relative",
              aspect: "3/4",
              border: selectedPages.has(page.pageNumber) ? "2px solid var(--brand)" : "1px solid var(--line)",
              borderRadius: "6px",
              background: "var(--surface)",
              cursor: readOnly ? "default" : "pointer",
              overflow: "hidden",
              transition: "border-color 0.2s, transform 0.2s",
              transform: selectedPages.has(page.pageNumber) ? "scale(0.98)" : "scale(1)",
            }}
            onClick={() => !readOnly && togglePageSelection(page.pageNumber)}
            onMouseEnter={(e) => !readOnly && !selectedPages.has(page.pageNumber) && (e.currentTarget.style.borderColor = "var(--brand)")}
            onMouseLeave={(e) => !readOnly && !selectedPages.has(page.pageNumber) && (e.currentTarget.style.borderColor = "var(--line)")}
          >
            {page.thumbnail ? (
              <img
                src={page.thumbnail}
                alt={`Page ${page.pageNumber}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: selectedPages.has(page.pageNumber) ? 0.7 : 1,
                  transition: "opacity 0.2s"
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #f0f0f0, #e8e8e8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: "var(--muted)",
                }}
              >
                Loading...
              </div>
            )}

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: selectedPages.has(page.pageNumber) ? "rgba(0, 0, 0, 0.3)" : "transparent",
                transition: "background 0.2s",
              }}
            >
              {!readOnly ? (
                <input
                  type="checkbox"
                  checked={selectedPages.has(page.pageNumber)}
                  onChange={() => togglePageSelection(page.pageNumber)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    opacity: selectedPages.has(page.pageNumber) ? 1 : 0.4,
                  }}
                />
              ) : selectedPages.has(page.pageNumber) ? (
                <div style={{ fontSize: "24px", color: "white", fontWeight: "bold" }}>✓</div>
              ) : null}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                background: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              {page.pageNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
