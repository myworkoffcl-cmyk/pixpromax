import type { Metadata } from "next";
import { FaqPageClient } from "./faq-client";

export const metadata: Metadata = { title: "FAQ", description: "Answers to common questions about PixProMax browser-based image and PDF tools.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  return <FaqPageClient />;
}
