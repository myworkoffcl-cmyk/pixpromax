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
  const matches = tools
    .filter((tool) => tool.status === "active")
    .filter((tool) => !normalized || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(normalized))
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
      <button className={`header-search-trigger ${open ? "active" : ""}`} type="button" onClick={() => { setOpen((value) => !value); if (!open) setFocused(true); }} aria-expanded={open} aria-haspopup="dialog" aria-controls="header-tool-search">
        <Search aria-hidden="true" />
        {open ? (
          <input
            ref={inputRef}
            type="search"
            placeholder={t("header.searchPlaceholder", 'Try "50 KB", "passport", or "PDF"')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); setFocused(false); } }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="header-search-input"
          />
        ) : (
          <span className="header-search-placeholder">{query || t("header.search", "Search tools")}</span>
        )}
        {open ? <X aria-hidden="true" onClick={(e) => { e.stopPropagation(); setQuery(""); setOpen(false); setFocused(false); }} /> : null}
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
