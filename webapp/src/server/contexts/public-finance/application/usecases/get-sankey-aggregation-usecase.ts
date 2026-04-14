import "server-only";

import type { SankeyData } from "@/server/contexts/public-finance/domain/models/sankey-data";
import type { IMunicipalityRepository } from "@/server/contexts/public-finance/domain/repositories/municipality-repository.interface";
import type { IFiscalSettlementRepository } from "@/server/contexts/public-finance/domain/repositories/fiscal-settlement-repository.interface";
import { CategoryAggregation } from "@/server/contexts/public-finance/domain/models/category-aggregation";
import { SankeyDataBuilder } from "@/server/contexts/public-finance/domain/services/sankey-data-builder";
import {
  buildCategoryAggregation,
  type ExpenseDisplayMode,
} from "@/server/contexts/public-finance/domain/services/settlement-to-aggregation";
import {
  MunicipalityNotFoundError,
  SettlementNotFoundError,
} from "@/server/contexts/public-finance/domain/types/errors";

interface GetSankeyAggregationParams {
  slug: string;
  fiscalYear: number;
  expenseMode: ExpenseDisplayMode;
}

interface GetSankeyAggregationResult {
  sankeyData: SankeyData;
  updatedAt: Date;
}

export class GetSankeyAggregationUsecase {
  constructor(
    private municipalityRepository: IMunicipalityRepository,
    private fiscalSettlementRepository: IFiscalSettlementRepository,
  ) {}

  async execute(params: GetSankeyAggregationParams): Promise<GetSankeyAggregationResult> {
    // 1. 自治体を取得
    const municipality = await this.municipalityRepository.findBySlug(params.slug);
    if (!municipality) {
      throw new MunicipalityNotFoundError(params.slug);
    }

    // 2. 決算データを取得
    const settlement = await this.fiscalSettlementRepository.findByMunicipalityAndYear(
      municipality.id,
      params.fiscalYear,
    );
    if (!settlement) {
      throw new SettlementNotFoundError(municipality.id, params.fiscalYear);
    }

    // 3. FiscalYearSettlement → CategoryAggregation 変換（千円→円変換含む）
    const rawAggregation = buildCategoryAggregation(settlement, params.expenseMode);

    // 4. 「その他」カテゴリをリネーム
    const aggregation = CategoryAggregation.renameOtherCategories(rawAggregation);

    // 5. SankeyData を構築（収支差額は SankeyDataBuilder 内で "(仕訳中)" として処理）
    const builder = new SankeyDataBuilder();
    const sankeyData = builder.build(aggregation);

    return { sankeyData, updatedAt: settlement.updatedAt };
  }
}
