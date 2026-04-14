import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/contexts/public-finance/infrastructure/prisma";
import { PrismaMunicipalityRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-municipality.repository";
import { PrismaFiscalSettlementRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-fiscal-settlement.repository";
import { GetSankeyAggregationUsecase } from "@/server/contexts/public-finance/application/usecases/get-sankey-aggregation-usecase";
import { CACHE_REVALIDATE_SECONDS } from "./constants";

interface TopPageDataParams {
  slugs: string[];
  financialYear: number;
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
        slugs: params.slugs,
        financialYear: params.financialYear,
        categoryType: "purpose",
      }),
      sankeyUsecase.execute({
        slugs: params.slugs,
        financialYear: params.financialYear,
        categoryType: "nature",
      }),
    ]);

    return {
      purpose: purposeData.sankeyData,
      nature: natureData.sankeyData,
    };
  },
  ["top-page-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["top-page-data"] },
);
