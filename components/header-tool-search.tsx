"use client";

import Link from "@/components/site-link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { tools } from "@/config/tools";

export function HeaderToolSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const normalized = query.trim().toLowerCase();
  const matches = tools
    .filter((tool) => tool.status === "active")
    .filter((tool) => !normalized || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(normalized))
    .slice(0, 6);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
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
      <button className={`header-search-trigger ${open ? "active" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="dialog" aria-controls="header-tool-search">
        {open ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
        <span>Search tools</span>
        <kbd>Ctrl K</kbd>
      </button>
      {open ? (
        <div className="header-search-panel" id="header-tool-search" role="dialog" aria-label="Search PixProMax tools">
          <label>
            <Search aria-hidden="true" />
            <span className="sr-only">Search image tools</span>
            <input autoFocus type="search" placeholder="Try “50 KB”, “passport”, or “PDF”" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} />
          </label>
          <div className="header-search-results">
            {matches.map((tool) => {
              const Icon = tool.icon;
              return <Link href={`/${tool.slug}`} key={tool.slug} onClick={() => { setOpen(false); setQuery(""); }}><span className={`search-result-icon accent-${tool.accent}`}><Icon aria-hidden="true" /></span><span><strong>{tool.name}</strong><small>{tool.description}</small></span></Link>;
            })}
            {matches.length === 0 ? <p>No matching tool. Try a format, size, or task.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
