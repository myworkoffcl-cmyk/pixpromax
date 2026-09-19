"use client";

import { useState, useEffect } from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface PDFPageInfo {
  fileIndex: number;
  fileName: string;
  pageNumber: number;
  totalPages: number;
  thumbnail?: string;
  id: string;
}

interface PDFPreviewProps {
  files: File[];
  onPageDelete?: (pageId: string) => void;
  deletedPageIds?: Set<string>;
  onAddFiles?: () => void;
  onMoveFile?: (index: number, direction: -1 | 1) => void;
  onDeleteFile?: (index: number) => void;
}

export function PDFPreview({ files, onPageDelete, deletedPageIds = new Set(), onAddFiles, onMoveFile, onDeleteFile }: PDFPreviewProps) {
  const [pageInfo, setPageInfo] = useState<PDFPageInfo[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeFiles = async () => {
      setLoading(true);
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).href;

        const allPages: PDFPageInfo[] = [];
        let totalPageCount = 0;

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const data = new Uint8Array(await file.arrayBuffer());
          const pdf = await pdfjs.getDocument({ data }).promise;
          const filePageCount = pdf.numPages;
          totalPageCount += filePageCount;

          for (let pageNum = 1; pageNum <= filePageCount; pageNum++) {
            const pageId = `${fileIndex}-${pageNum}`;
            const pageInfo: PDFPageInfo = {
              fileIndex,
              fileName: file.name,
              pageNumber: pageNum,
              totalPages: filePageCount,
              id: pageId,
            };

            try {
              const page = await pdf.getPage(pageNum);
              const viewport = page.getViewport({ scale: 1 });
              const canvas = document.createElement("canvas");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const context = canvas.getContext("2d");

              if (!context) {
                console.error(`Failed to get canvas context for page ${pageNum}`);
                return;
              }

              await page.render({ canvas, canvasContext: context, viewport }).promise;
              const dataUrl = canvas.toDataURL("image/png");

              if (!dataUrl || dataUrl.length < 100) {
                console.warn(`Invalid data URL generated for page ${pageNum}, length: ${dataUrl?.length || 0}`);
              }

              pageInfo.thumbnail = dataUrl;
            } catch (error) {
              console.error(`Error rendering page ${pageNum}:`, error);
            }

            allPages.push(pageInfo);
            setPageInfo([...allPages]);
          }
        }

        setTotalPages(totalPageCount);
      } catch (error) {
        console.error("Error analyzing PDFs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (files.length > 0) {
      analyzeFiles();
    } else {
      setPageInfo([]);
      setTotalPages(0);
      setLoading(false);
    }
  }, [files]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>Analyzing PDFs...</div>
      </div>
    );
  }

  if (pageInfo.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "14px", color: "var(--muted)" }}>No files selected</div>
      </div>
    );
  }

  const fileGroups = files.map((file, idx) => {
    const filePages = pageInfo.filter((p) => p.fileIndex === idx);
    return { file, pages: filePages };
  });

  return (
    <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Merged PDF Preview</div>
        <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>{totalPages - deletedPageIds.size} pages total</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
        {fileGroups.map((group, fileIdx) => (
          <div key={fileIdx}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px", padding: "6px 12px", background: "color-mix(in srgb, var(--surface), transparent 20%)", borderRadius: "6px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink)" }}>{fileIdx + 1}. {group.file.name}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>{Math.ceil(group.file.size / 1024)} KB</div>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => onMoveFile?.(fileIdx, -1)}
                  disabled={fileIdx === 0}
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "transparent",
                    color: fileIdx === 0 ? "var(--muted)" : "var(--brand)",
                    cursor: fileIdx === 0 ? "not-allowed" : "pointer",
                    opacity: fileIdx === 0 ? 0.4 : 1,
                    transition: "color .2s ease",
                  }}
                  onMouseEnter={(e) => fileIdx > 0 && (e.currentTarget.style.color = "var(--brand-dark)")}
                  onMouseLeave={(e) => fileIdx > 0 && (e.currentTarget.style.color = "var(--brand)")}
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveFile?.(fileIdx, 1)}
                  disabled={fileIdx === files.length - 1}
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "transparent",
                    color: fileIdx === files.length - 1 ? "var(--muted)" : "var(--brand)",
                    cursor: fileIdx === files.length - 1 ? "not-allowed" : "pointer",
                    opacity: fileIdx === files.length - 1 ? 0.4 : 1,
                    transition: "color .2s ease",
                  }}
                  onMouseEnter={(e) => fileIdx < files.length - 1 && (e.currentTarget.style.color = "var(--brand-dark)")}
                  onMouseLeave={(e) => fileIdx < files.length - 1 && (e.currentTarget.style.color = "var(--brand)")}
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteFile?.(fileIdx)}
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "transparent",
                    color: "var(--muted)",
                    cursor: "pointer",
                    transition: "color .2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#a33a40")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                  title="Delete file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px", paddingLeft: "12px" }}>
              {group.pages.filter(page => !deletedPageIds.has(page.id)).map((page) => (
                <div
                  key={page.id}
                  style={{
                    aspectRatio: "3/4",
                    border: "1px solid var(--line)",
                    borderRadius: "6px",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                  } as React.CSSProperties}
                >
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.pageNumber}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #f0f0f0, #e8e8e8)",
                        borderRadius: "4px",
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
                  <button
                    type="button"
                    onClick={() => onPageDelete?.(page.id)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(0, 0, 0, 0.7)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      pointerEvents: "auto",
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    title="Delete page"
                  >
                    <Trash2 size={14} color="white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "6px" }}>
        <button
          type="button"
          onClick={onAddFiles}
          style={{
            flex: 1,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            background: "var(--surface)",
            color: "var(--brand)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            transition: "background .2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--brand), transparent 92%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
          title="Add more files"
        >
          <span style={{ fontSize: "16px" }}>+</span> Add Files
        </button>
        <div style={{ fontSize: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>
          <strong style={{ color: "var(--ink)" }}>{files.length}</strong> • <strong style={{ color: "var(--ink)" }}>{totalPages - deletedPageIds.size}</strong>
        </div>
      </div>
    </div>
  );
}
