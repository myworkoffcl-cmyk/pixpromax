"use client";

import Link from "@/components/site-link";
import { ScanLine } from "lucide-react";
import { tools } from "@/config/tools";
import { useTranslation } from "@/lib/use-translation";

export function SiteFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true"><ScanLine /></span><span className="brand-word">PixPro<b>Max</b></span></Link>
          <p>{t("footer.tagline", "Thoughtful image tools that keep everyday editing fast, free, and on your device.")}</p>
        </div>
        <div><h2>{t("footer.popularTools", "Popular tools")}</h2>{tools.slice(0, 4).map((tool) => <Link key={tool.slug} href={`/${tool.slug}`}>{t(`tools.${tool.slug}`, tool.name)}</Link>)}</div>
        <div><h2>{t("footer.company", "Company")}</h2><Link href="/about">{t("footer.about", "About")}</Link><Link href="/contact">{t("footer.contact", "Contact")}</Link><Link href="/faq">{t("footer.faq", "FAQ")}</Link><Link href="/privacy-policy">{t("footer.privacy", "Privacy Policy")}</Link><Link href="/terms">{t("footer.terms", "Terms & Conditions")}</Link><Link href="/disclaimer">{t("footer.disclaimer", "Disclaimer")}</Link></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} PixProMax. {t("footer.copyright", "All rights reserved.")}</span><span>{t("footer.mission", "Made for images, respectful of privacy.")}</span></div>
    </footer>
  );
}
