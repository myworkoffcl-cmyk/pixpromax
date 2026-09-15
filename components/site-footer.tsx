import Link from "@/components/site-link";
import { ScanLine } from "lucide-react";
import { tools } from "@/config/tools";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true"><ScanLine /></span><span className="brand-word">PixPro<b>Max</b></span></Link>
          <p>Thoughtful image tools that keep everyday editing fast, free, and on your device.</p>
        </div>
        <div><h2>Popular tools</h2>{tools.slice(0, 4).map((tool) => <Link key={tool.slug} href={`/${tool.slug}`}>{tool.name}</Link>)}</div>
        <div><h2>Company</h2><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/disclaimer">Disclaimer</Link></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} PixProMax. All rights reserved.</span><span>Made for images, respectful of privacy.</span></div>
    </footer>
  );
}
