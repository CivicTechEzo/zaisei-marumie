import "server-only";
import { redirect } from "next/navigation";
import { loadMunicipalities } from "@/server/contexts/public-finance/presentation/loaders/load-municipalities";
import { loadAvailableYears } from "@/server/contexts/public-finance/presentation/loaders/load-available-years";

interface OrgPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { slug } = await params;

  // slugの妥当性をチェックし、必要に応じてデフォルトslugを使用
  const { default: defaultSlug, municipalities } = await loadMunicipalities();
  const validSlug = municipalities.some((m) => m.slug === slug) ? slug : defaultSlug;

  if (!validSlug) {
    redirect("/");
  }

  // DBから最新年度を取得してリダイレクト
  const { latestYear } = await loadAvailableYears(validSlug);

  if (!latestYear) {
    // データがまだ取り込まれていない場合、固定年度で表示（空状態になる）
    redirect(`/o/${validSlug}/2022`);
  }

  redirect(`/o/${validSlug}/${latestYear}`);
}
