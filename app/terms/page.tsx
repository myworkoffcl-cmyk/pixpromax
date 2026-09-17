import type { Metadata } from "next";
import { TermsPageClient } from "./terms-client";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Plain-language terms for using PixProMax image and PDF tools.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <TermsPageClient />;
}
