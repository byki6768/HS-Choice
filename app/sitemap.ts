import type { MetadataRoute } from "next";
import { getChoices } from "@/entities/choice";
import { routes } from "@/shared/config";
import { absoluteUrl } from "@/shared/config/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(routes.home),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: absoluteUrl(routes.feed("popular")),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(routes.statsHome),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];

  try {
    const choices = await getChoices("latest");

    for (const choice of choices) {
    const images = [choice.optionAImage, choice.optionBImage].filter(
      (image): image is string => Boolean(image),
    );

    entries.push({
      url: absoluteUrl(routes.choice(choice.id)),
      lastModified: choice.createdAt ? new Date(choice.createdAt) : now,
      changeFrequency: "daily",
      priority: 0.7,
      ...(images.length > 0 ? { images } : {}),
    });
    }
  } catch {
    // Keep public routes even if games cannot be loaded yet.
  }

  return entries;
}
