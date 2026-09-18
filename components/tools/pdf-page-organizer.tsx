"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface PDFPageInfo {
  pageNumber: number;
  thumbnail?: string;
  id: string;
}

interface PDFPageOrganizerProps {
  file: File;
  onPageOrderChange?: (pageOrder: number[]) => void;
}

export function PDFPageOrganizer({ file, onPageOrderChange }: PDFPageOrganizerProps) {
  const [pageInfo, setPageInfo] = useState<PDFPageInfo[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
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
        }

        setPageInfo(allPages);
        setPageOrder(allPages.map(p => p.pageNumber));
      } catch (error) {
        console.error("Error analyzing PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      analyzeFile();
    }
  }, [file]);

  useEffect(() => {
    onPageOrderChange?.(pageOrder);
  }, [pageOrder, onPageOrderChange]);

  const movePageUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...pageOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setPageOrder(newOrder);
  };

  const movePageDown = (index: number) => {
    if (index === pageOrder.length - 1) return;
    const newOrder = [...pageOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setPageOrder(newOrder);
  };

  const removePage = (pageNum: number) => {
    setPageOrder(pageOrder.filter(p => p !== pageNum));
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
      <div style={{ fontSize: "13px", color: "var(--ink)", paddingBottom: "8px", borderBottom: "1px solid var(--line)" }}>
        <strong>{pageOrder.length}</strong> of <strong>{pageInfo.length}</strong> pages
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
        {pageOrder.map((pageNum, index) => {
          const pageData = pageInfo.find(p => p.pageNumber === pageNum);
          if (!pageData) return null;

          return (
            <div
              key={pageData.id}
              style={{
                position: "relative",
                aspect: "3/4",
                border: "2px solid var(--line)",
                borderRadius: "8px",
                background: "var(--surface)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {pageData.thumbnail ? (
                <img
                  src={pageData.thumbnail}
                  alt={`Page ${pageNum}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
                {pageNum}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "4px",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  background: "rgba(0, 0, 0, 0.4)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => movePageUp(index)}
                    disabled={index === 0}
                    style={{
                      flex: 1,
                      padding: "4px",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid white",
                      borderRadius: "4px",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: index === 0 ? 0.5 : 1,
                    }}
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePageDown(index)}
                    disabled={index === pageOrder.length - 1}
                    style={{
                      flex: 1,
                      padding: "4px",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid white",
                      borderRadius: "4px",
                      cursor: index === pageOrder.length - 1 ? "not-allowed" : "pointer",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: index === pageOrder.length - 1 ? 0.5 : 1,
                    }}
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removePage(pageNum)}
                  style={{
                    padding: "6px",
                    background: "rgba(255,59,48,0.8)",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Remove page"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
