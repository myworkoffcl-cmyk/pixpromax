"use client";

import Link from "@/components/site-link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { tools } from "@/config/tools";
import { useTranslation } from "@/lib/use-translation";

export function HeaderToolSearch() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = query.trim().toLowerCase();
  const fileSizeRegex = /^\d+\s*(kb|mb|gb|bytes?)/i;
  const isFileSizeQuery = fileSizeRegex.test(normalized);

  const matches = tools
    .filter((tool) => tool.status === "active")
    .filter((tool) => {
      if (!normalized) return true;

      const toolText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();

      if (isFileSizeQuery) {
        const sizeRelatedCategories = ["Optimization", "Batch tools", "Applications"];
        const sizeKeywords = ["compress", "reduce", "size", "kb", "mb", "gb", "bulk", "optimization"];

        const hasRelevantCategory = sizeRelatedCategories.includes(tool.category);
        const hasSizeKeyword = sizeKeywords.some(keyword => toolText.includes(keyword));

        return hasRelevantCategory || hasSizeKeyword;
      }

      return toolText.includes(normalized);
    })
    .slice(0, 6);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setFocused(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        setFocused(true);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="header-search-wrap" ref={searchRef}>
      <button className={`header-search-trigger ${open ? "active" : ""}`} type="button" onClick={() => { if (!open) { setOpen(true); setFocused(true); } }} aria-expanded={open} aria-haspopup="dialog" aria-controls="header-tool-search">
        {open ? (
          <input
            ref={inputRef}
            type="text"
            placeholder={t("header.searchPlaceholder", 'Try "50 KB", "passport", or "PDF"')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { event.stopPropagation(); if (event.key === " ") { event.preventDefault(); if (inputRef.current) { const start = inputRef.current.selectionStart || 0; const end = inputRef.current.selectionEnd || 0; setQuery(query.substring(0, start) + " " + query.substring(end)); setTimeout(() => { if (inputRef.current) inputRef.current.setSelectionRange(start + 1, start + 1); }, 0); } } if (event.key === "Escape") { setOpen(false); setFocused(false); } }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="header-search-input"
          />
        ) : (
          <span className="header-search-placeholder">{query || t("header.search", "Search tools")}</span>
        )}
      </button>
      {open ? (
        <div className="header-search-panel" id="header-tool-search" role="dialog" aria-label="Search PixProMax tools">
          <div className="header-search-results">
            {matches.map((tool) => {
              const Icon = tool.icon;
              return <Link href={`/${tool.slug}`} key={tool.slug} onClick={() => { setOpen(false); setQuery(""); setFocused(false); }}><span className={`search-result-icon accent-${tool.accent}`}><Icon aria-hidden="true" /></span><span><strong>{tool.name}</strong><small>{tool.description}</small></span></Link>;
            })}
            {matches.length === 0 && query ? <p>{t("header.searchNoResults", "No matching tool. Try a format, size, or task.")}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}