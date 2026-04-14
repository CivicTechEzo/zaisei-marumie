import "server-only";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AboutSection from "@/client/components/common/AboutSection";
import LinkCardsSection from "@/client/components/common/LinkCardsSection";

import ExplanationSection from "@/client/components/common/ExplanationSection";
import TransparencySection from "@/client/components/common/TransparencySection";
import MainColumn from "@/client/components/layout/MainColumn";
import CashFlowSection from "@/client/components/top-page/CashFlowSection";
import ProgressSection from "@/client/components/top-page/ProgressSection";
import { loadTopPageData } from "@/server/contexts/public-finance/presentation/loaders/load-top-page-data";
import { loadMunicipalities } from "@/server/contexts/public-finance/presentation/loaders/load-municipalities";
import { loadAvailableYears } from "@/server/contexts/public-finance/presentation/loaders/load-available-years";

export const revalidate = 300; // 5 minutes

interface OrgPageProps {
  params: Promise<{
    slug: string;
    year: string;
  }>;
}

export async function generateMetadata({ params }: OrgPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { municipalities } = await loadMunicipalities();
  const currentMunicipality = municipalities.find((m) => m.slug === slug);

  const title = currentMunicipality?.displayName
    ? `${currentMunicipality.displayName} - 自治体財政まる見え`
    : "自治体財政まる見え";

  return {
    title,
  };
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { slug, year: yearParam } = await params;

  // 年度の妥当性をチェック
  const yearNumber = parseInt(yearParam, 10);
  if (Number.isNaN(yearNumber) || yearNumber < 2000 || yearNumber > 2030) {
    // 利用可能な最新年度にリダイレクト
    const { latestYear } = await loadAvailableYears(slug);
    redirect(`/o/${slug}/${latestYear ?? 2022}`);
  }
  const fiscalYear = yearNumber;

  // slugの妥当性をチェックし、必要に応じてリダイレクト
  const { default: defaultSlug, municipalities } = await loadMunicipalities();
  if (!municipalities.some((m) => m.slug === slug)) {
    redirect(`/o/${defaultSlug}/${fiscalYear}`);
  }

  // 現在のslugに対応する自治体を取得
  const currentMunicipality = municipalities.find((m) => m.slug === slug);

  // サンキー図データを取得
  const data = await loadTopPageData({
    slug,
    fiscalYear,
  }).catch((error) => {
    console.error("loadTopPageData error:", error);
    return null;
  });

  return (
    <MainColumn>
      <CashFlowSection
        purpose={data?.purpose ?? null}
        nature={data?.nature ?? null}
        municipalityName={currentMunicipality?.displayName}
      />
      <TransparencySection title="あなたのまちのお金の使いみち、見てみませんか？" />

      <ProgressSection />
      <ExplanationSection />
      <AboutSection />
      <LinkCardsSection />
    </MainColumn>
  );
}
