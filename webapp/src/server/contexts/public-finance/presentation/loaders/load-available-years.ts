import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/contexts/public-finance/infrastructure/prisma";
import { PrismaMunicipalityRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-municipality.repository";
import { PrismaFiscalSettlementRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-fiscal-settlement.repository";
import { CACHE_REVALIDATE_SECONDS } from "./constants";

interface AvailableYearsResult {
  availableYears: number[];
  latestYear: number | null;
}

/**
 * 特定自治体の利用可能年度を取得する
 */
export const loadAvailableYears = unstable_cache(
  async (slug: string): Promise<AvailableYearsResult> => {
    const municipalityRepository = new PrismaMunicipalityRepository(prisma);
    const fiscalSettlementRepository = new PrismaFiscalSettlementRepository(prisma);

    const municipality = await municipalityRepository.findBySlug(slug);
    if (!municipality) {
      return { availableYears: [], latestYear: null };
    }

    const [availableYears, latestYear] = await Promise.all([
      fiscalSettlementRepository.getAvailableYears(municipality.id),
      fiscalSettlementRepository.getLatestYear(municipality.id),
    ]);

    return { availableYears, latestYear };
  },
  ["available-years"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["available-years"] },
);

/**
 * 全自治体を通じた利用可能年度の一覧を取得する（ヘッダーのドロップダウン用）
 */
export const loadAllAvailableYears = unstable_cache(
  async (): Promise<number[]> => {
    const records = await prisma.fiscalYearSettlement.findMany({
      select: { fiscalYear: true },
      distinct: ["fiscalYear"],
      orderBy: { fiscalYear: "desc" },
    });
    return records.map((r) => r.fiscalYear);
  },
  ["all-available-years"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["all-available-years"] },
);
