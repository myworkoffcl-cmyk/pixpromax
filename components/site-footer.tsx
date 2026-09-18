"use client";

import Link from "@/components/site-link";
import { ScanLine, Lock, Zap, BookOpen, Code, HelpCircle, CheckCircle2, Download } from "lucide-react";
import { tools } from "@/config/tools";
import { useTranslation } from "@/lib/use-translation";
import { useState } from "react";

export function SiteFooter() {
  const { t } = useTranslation("common");
  const activeTools = tools.filter(t => t.status === "active");
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const trustBadges = [
    { icon: Lock, label: "100% Private", desc: "Files never leave your device" },
    { icon: Zap, label: "Lightning Fast", desc: "Process locally, no upload delays" },
    { icon: CheckCircle2, label: "No Account Needed", desc: "Start editing instantly" },
  ];

  const sections = [
    {
      title: "Popular Tools",
      id: "tools",
      links: tools.slice(0, 5).map(tool => ({
        label: t(`tools.${tool.slug}`, tool.name),
        href: `/${tool.slug}`
      }))
    },
    {
      title: "Resources",
      id: "resources",
      links: [
        { label: "Blog & Guides", href: "/blog" },
        { label: "API Documentation", href: "/docs/api" },
        { label: "Help & Support", href: "/help" },
        { label: "Status Page", href: "/status" },
      ]
    },
    {
      title: "Legal",
      id: "legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "GDPR Compliance", href: "/privacy-policy#gdpr" },
      ]
    },
    {
      title: "Company",
      id: "company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
      ]
    }
  ];

  return (
    <footer className="site-footer">
      {/* Trust Badges Section */}
      <div className="footer-badges">
        <div className="shell">
          <div className="badges-grid">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="trust-badge">
                  <Icon aria-hidden="true" className="badge-icon" />
                  <div>
                    <div className="badge-label">{badge.label}</div>
                    <div className="badge-desc">{badge.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="shell footer-content">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true"><ScanLine /></span><span className="brand-word">PixPro<b>Max</b></span></Link>
            <p className="footer-tagline">{t("footer.tagline", "Thoughtful image tools that keep everyday editing fast, free, and on your device.")}</p>
            <div className="tools-count">
              <span className="count-badge">{activeTools.length}+</span>
              <span className="count-text">Tools Available</span>
            </div>
          </div>

          {/* Links Grid - Desktop */}
          <div className="footer-links-grid-desktop">
            {sections.map(section => (
              <div key={section.id} className="footer-section">
                <h3 className="section-title">{section.title}</h3>
                <ul className="section-links">
                  {section.links.map((link, i) => (
                    <li key={i}><Link href={link.href}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Links Accordion - Mobile */}
          <div className="footer-links-accordion-mobile">
            {sections.map(section => (
              <div key={section.id} className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => setExpandedMobile(expandedMobile === section.id ? null : section.id)}
                  aria-expanded={expandedMobile === section.id}
                >
                  <span>{section.title}</span>
                  <span className="toggle-icon">›</span>
                </button>
                {expandedMobile === section.id && (
                  <ul className="accordion-content">
                    {section.links.map((link, i) => (
                      <li key={i}><Link href={link.href}>{link.label}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Chrome Extension CTA */}
          <div className="footer-extension">
            <div className="extension-card">
              <Download className="extension-icon" aria-hidden="true" />
              <div>
                <h3>Save Time with Browser Extension</h3>
                <p>Convert & compress images right from your browser</p>
              </div>
              <Link href="https://chrome.google.com/webstore" className="extension-btn" target="_blank" rel="noopener noreferrer">
                Install Extension →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom-bar">
        <div className="shell footer-bottom">
          <div className="footer-info">
            <span className="copyright">© {new Date().getFullYear()} PixProMax. {t("footer.copyright", "All rights reserved.")}</span>
            <span className="mission">{t("footer.mission", "Made for images, respectful of privacy.")}</span>
          </div>
          <div className="footer-theme-selector">
            <span className="theme-label">Theme</span>
            <button className="theme-toggle" aria-label="Toggle theme">
              <span>🌙 / ☀️</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
