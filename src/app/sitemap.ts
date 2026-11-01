import { MetadataRoute } from "next";
import { INITIAL_CMS_DATA, INITIAL_PRODUCTS } from "@/data/initial-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kodeva.netlify.app";

  const productUrls: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((p) => ({
    url: `${baseUrl}/catalog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const articleUrls: MetadataRoute.Sitemap = INITIAL_CMS_DATA.articles
    .filter((a) => a.status === "published")
    .map((a) => ({
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...productUrls,
    ...articleUrls,
  ];
}

