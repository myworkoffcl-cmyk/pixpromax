import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    ...tools.filter((tool) => tool.status === "active").map((tool) => ({ url: `${SITE_URL}/${tool.slug}` })),
    { url: `${SITE_URL}/privacy` },
    { url: `${SITE_URL}/terms` },
  ];
}
