import type { MetadataRoute } from "next";
import { loadMunicipalities } from "@/server/contexts/public-finance/presentation/loaders/load-municipalities";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.WEBAPP_URL || "https://zaisei-marumie.example.com";

  // 自治体データを取得（0件の場合は空配列が返される）
  const { municipalities } = await loadMunicipalities();

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // 各自治体のページを追加
  municipalities.forEach((m) => {
    sitemap.push({
      url: `${baseUrl}/o/${m.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });

  return sitemap;
}
