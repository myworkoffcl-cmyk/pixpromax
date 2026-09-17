"use client";

import Link from "@/components/site-link";
import { FileStack, House, Images, Menu, Moon, ScanLine, ShieldCheck, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeaderToolSearch } from "@/components/header-tool-search";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="PixProMax home">
          <span className="brand-mark" aria-hidden="true"><ScanLine /></span>
          <span className="brand-word"><span className="brand-pix">Pix</span><span className="brand-pro">Pro</span><b>Max</b></span>
        </Link>
        <HeaderToolSearch />
        <div className="header-actions">
          <Link href="/#directory-image-tools" className="icon-button" aria-label="Image tools"><Images /></Link>
          <Link href="/#directory-document-tools" className="icon-button" aria-label="Document tools"><FileStack /></Link>
          <div className="header-options-wrap" ref={menuRef}>
            <button className={`icon-button menu-button ${open ? "active" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" aria-controls="header-options-menu" aria-label={open ? "Close options menu" : "Open options menu"}>
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
            {open ? (
              <nav id="header-options-menu" className="header-options-menu" aria-label="Site options">
                <Link href="/" onClick={() => setOpen(false)}><House aria-hidden="true" /><span><strong>Home</strong><small>Return to PixProMax</small></span></Link>
                <Link href="/#directory-image-tools" onClick={() => setOpen(false)}><Images aria-hidden="true" /><span><strong>Image tools</strong><small>Edit, resize, and convert</small></span></Link>
                <Link href="/#directory-document-tools" onClick={() => setOpen(false)}><FileStack aria-hidden="true" /><span><strong>Document tools</strong><small>Work with images and PDFs</small></span></Link>
                <Link href="/privacy-policy" onClick={() => setOpen(false)}><ShieldCheck aria-hidden="true" /><span><strong>Privacy</strong><small>How local processing works</small></span></Link>
                <button type="button" onClick={() => { setTheme(theme === "light" ? "dark" : "light"); setOpen(false); }} className="menu-theme-button"><span className="theme-icon">{theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</span><span><strong>Theme</strong><small>{theme === "light" ? "Switch to dark" : "Switch to light"}</small></span></button>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
