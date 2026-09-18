"use client";

import Link from "@/components/site-link";
import { House, Menu, ScanLine, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeaderToolSearch } from "@/components/header-tool-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/lib/use-translation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("common");

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
          <LanguageSelector />
          <div className="header-options-wrap" ref={menuRef}>
            <button className={`icon-button menu-button ${open ? "active" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" aria-controls="header-options-menu" aria-label={open ? "Close options menu" : "Open options menu"}>
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
            {open ? (
              <nav id="header-options-menu" className="header-options-menu" aria-label="Site options">
                <Link href="/" onClick={() => setOpen(false)}><House aria-hidden="true" /><span><strong>{t("header.home", "Home")}</strong><small>{t("nav.returnToHome", "Return to PixProMax")}</small></span></Link>
                <Link href="/privacy-policy" onClick={() => setOpen(false)}><ShieldCheck aria-hidden="true" /><span><strong>{t("header.privacy", "Privacy")}</strong><small>{t("nav.howLocalProcessingWorks", "How local processing works")}</small></span></Link>
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: "48px", gap: "8px" }}>
                  <ThemeToggle />
                </div>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
