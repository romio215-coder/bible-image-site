import type { MetadataRoute } from "next";
import { allChapters, chapterPath } from "@/lib/bible";
import { topics } from "@/lib/collections";
import { publicOrigin } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = publicOrigin();
  if (!origin) return [];
  return [
    "/",
    "/daily",
    "/topics",
    "/people",
    "/events",
    "/timeline",
    "/about",
    ...allChapters.map(chapterPath),
    ...topics.map((t) => `/topics/${t.slug}`),
  ].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: path === "/daily" ? "daily" : "monthly",
  }));
}
