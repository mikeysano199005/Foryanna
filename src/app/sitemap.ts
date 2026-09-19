import type { MetadataRoute } from "next";
import { getTopAnime } from "@/lib/api/jikan";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://animora.example.com";

const STATIC_ROUTES = [
  "",
  "/anime",
  "/genres",
  "/trending",
  "/popular",
  "/season",
  "/search",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }));

  try {
    const { data } = await getTopAnime(undefined, 1, 25);
    const animeEntries: MetadataRoute.Sitemap = data.map((anime) => ({
      url: `${SITE_URL}/anime/${anime.mal_id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticEntries, ...animeEntries];
  } catch {
    return staticEntries;
  }
}
