import type { Metadata } from "next";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = { title: "Contact", description: "Find the current contact options for PixProMax support, feedback, and privacy questions.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <ContactPageClient />;
}
