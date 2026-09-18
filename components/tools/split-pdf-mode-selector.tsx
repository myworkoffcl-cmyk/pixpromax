"use client";

interface SplitPdfModeSelectorProps {
  selectedMode: "range" | "pages" | "all";
  onModeChange: (mode: "range" | "pages" | "all") => void;
}

export function SplitPdfModeSelector({ selectedMode, onModeChange }: SplitPdfModeSelectorProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
      <button
        type="button"
        onClick={() => onModeChange("pages")}
        style={{
          padding: "8px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: selectedMode === "pages" ? "600" : "500",
          color: selectedMode === "pages" ? "var(--brand)" : "var(--muted)",
          borderBottom: selectedMode === "pages" ? "2px solid var(--brand)" : "none",
          transition: "color 0.2s ease"
        }}
      >
        Select Pages
      </button>
      <button
        type="button"
        onClick={() => onModeChange("range")}
        style={{
          padding: "8px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: selectedMode === "range" ? "600" : "500",
          color: selectedMode === "range" ? "var(--brand)" : "var(--muted)",
          borderBottom: selectedMode === "range" ? "2px solid var(--brand)" : "none",
          transition: "color 0.2s ease"
        }}
      >
        Page Ranges
      </button>
      <button
        type="button"
        onClick={() => onModeChange("all")}
        style={{
          padding: "8px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: selectedMode === "all" ? "600" : "500",
          color: selectedMode === "all" ? "var(--brand)" : "var(--muted)",
          borderBottom: selectedMode === "all" ? "2px solid var(--brand)" : "none",
          transition: "color 0.2s ease"
        }}
      >
        Extract All
      </button>
    </div>
  );
}
