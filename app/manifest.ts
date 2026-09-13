import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PixProMax — Free Online Image Tools",
    short_name: "PixProMax",
    description: "Fast, private, browser-based tools to compress, resize, convert, and prepare images.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7f2",
    theme_color: "#176b4d",
    categories: ["photo", "utilities", "productivity"],
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png", purpose: "any" }],
  };
}
