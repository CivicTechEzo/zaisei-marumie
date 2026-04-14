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
import { loadOrganizations } from "@/server/contexts/public-finance/presentation/loaders/load-organizations";

export const revalidate = 300; // 5 minutes

const DEFAULT_YEAR = 2022;

interface OrgPageProps {
  params: Promise<{
    slug: string;
    year: string;
  }>;
}

export async function generateMetadata({ params }: OrgPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { organizations } = await loadOrganizations();
  const currentOrganization = organizations.find((org) => org.slug === slug);

  const title = currentOrganization?.displayName
    ? `${currentOrganization.displayName} - 自治体財政まる見え`
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
    redirect(`/o/${slug}/${DEFAULT_YEAR}`);
  }
  const financialYear = yearNumber;

  // slugの妥当性をチェックし、必要に応じてリダイレクト
  const { default: defaultSlug, organizations } = await loadOrganizations();
  if (!organizations.some((org) => org.slug === slug)) {
    redirect(`/o/${defaultSlug}/${financialYear}`);
  }

  const slugs = [slug];

  // 現在のslugに対応する組織を取得
  const currentOrganization = organizations.find((org) => org.slug === slug);

  // サンキー図データを取得
  const data = await loadTopPageData({
    slugs,
    financialYear,
  }).catch((error) => {
    console.error("loadTopPageData error:", error);
    return null;
  });

  return (
    <MainColumn>
      <CashFlowSection
        purpose={data?.purpose ?? null}
        nature={data?.nature ?? null}
        organizationName={currentOrganization?.displayName}
      />
      <TransparencySection title="あなたのまちのお金の使いみち、見てみませんか？" />

      <ProgressSection />
      <ExplanationSection />
      <AboutSection />
      <LinkCardsSection />
    </MainColumn>
  );
}
