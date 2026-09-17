import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";

export const metadata: Metadata = { title: "About", description: "Learn about PixProMax and its practical browser-based image and PDF tools.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <AboutPageClient />;
}
