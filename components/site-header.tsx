"use client";

import Link from "@/components/site-link";
import { Menu, ScanLine, X } from "lucide-react";
import { useState } from "react";
import { tools } from "@/config/tools";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderToolSearch } from "@/components/header-tool-search";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const activeTools = tools.filter((tool) => tool.status === "active");

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="PixProMax home">
          <span className="brand-mark" aria-hidden="true"><ScanLine /></span>
          <span className="brand-word">PixPro<b>Max</b></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/#tools">All tools</Link>
          {activeTools.slice(0, 3).map((tool) => <Link key={tool.slug} href={`/${tool.slug}`}>{tool.name.replace(" Image", "")}</Link>)}
        </nav>
        <div className="header-actions">
          <HeaderToolSearch />
          <ThemeToggle />
          <button className="icon-button menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu">
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
          {tools.map((tool) => <Link key={tool.slug} href={`/${tool.slug}`} onClick={() => setOpen(false)}>{tool.name}</Link>)}
        </nav>
      )}
    </header>
  );
}
