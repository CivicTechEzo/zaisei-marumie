import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/contexts/public-finance/infrastructure/prisma";
import { PrismaMunicipalityRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-municipality.repository";
import { PrismaFiscalSettlementRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-fiscal-settlement.repository";
import { GetSankeyAggregationUsecase } from "@/server/contexts/public-finance/application/usecases/get-sankey-aggregation-usecase";
import { CACHE_REVALIDATE_SECONDS } from "./constants";

interface TopPageDataParams {
  slug: string;
  fiscalYear: number;
}

export const loadTopPageData = unstable_cache(
  async (params: TopPageDataParams) => {
    const municipalityRepository = new PrismaMunicipalityRepository(prisma);
    const fiscalSettlementRepository = new PrismaFiscalSettlementRepository(prisma);

    const sankeyUsecase = new GetSankeyAggregationUsecase(
      municipalityRepository,
      fiscalSettlementRepository,
    );

    // 目的別サンキーと性質別サンキーを並列実行
    const [purposeData, natureData] = await Promise.all([
      sankeyUsecase.execute({
        slug: params.slug,
        fiscalYear: params.fiscalYear,
        expenseMode: "purpose",
      }),
      sankeyUsecase.execute({
        slug: params.slug,
        fiscalYear: params.fiscalYear,
        expenseMode: "nature",
      }),
    ]);

    return {
      purpose: purposeData.sankeyData,
      nature: natureData.sankeyData,
      updatedAt: purposeData.updatedAt.toISOString(),
    };
  },
  ["top-page-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["top-page-data"] },
);
