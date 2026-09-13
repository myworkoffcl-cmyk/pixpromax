"use client";

import Link from "@/components/site-link";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { tools } from "@/config/tools";

export function HeaderToolSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matches = tools
    .filter((tool) => tool.status === "active")
    .filter((tool) => !normalized || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(normalized))
    .slice(0, 6);

  return (
    <div className="header-search-wrap">
      <button className={`header-search-trigger ${open ? "active" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="header-tool-search">
        {open ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
        <span>Search tools</span>
      </button>
      {open ? (
        <div className="header-search-panel" id="header-tool-search">
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
