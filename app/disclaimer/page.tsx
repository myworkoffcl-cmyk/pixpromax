import type { Metadata } from "next";
import { DisclaimerPageClient } from "./disclaimer-client";

export const metadata: Metadata = { title: "Disclaimer", description: "Important limitations for PixProMax image and PDF utilities.", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return <DisclaimerPageClient />;
}
