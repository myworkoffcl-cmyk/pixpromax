import type { Metadata } from "next";
import { PrivacyPolicyPageClient } from "./privacy-policy-client";

export const metadata: Metadata = { title: "Privacy Policy", description: "How PixProMax handles files, browser storage, advertising, and optional analytics.", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient />;
}
