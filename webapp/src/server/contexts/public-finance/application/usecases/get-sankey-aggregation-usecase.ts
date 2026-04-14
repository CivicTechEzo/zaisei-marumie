import "server-only";

import type { SankeyData } from "@/server/contexts/public-finance/domain/models/sankey-data";
import type { IMunicipalityRepository } from "@/server/contexts/public-finance/domain/repositories/municipality-repository.interface";
import type { IFiscalSettlementRepository } from "@/server/contexts/public-finance/domain/repositories/fiscal-settlement-repository.interface";
import {
  CategoryAggregation,
} from "@/server/contexts/public-finance/domain/models/category-aggregation";
import { SankeyDataBuilder } from "@/server/contexts/public-finance/domain/services/sankey-data-builder";
import {
  buildCategoryAggregation,
  type ExpenseDisplayMode,
} from "@/server/contexts/public-finance/domain/services/settlement-to-aggregation";

interface GetSankeyAggregationParams {
  slugs: string[];
  financialYear: number;
  categoryType: ExpenseDisplayMode;
}

interface GetSankeyAggregationResult {
  sankeyData: SankeyData;
}

export class GetSankeyAggregationUsecase {
  constructor(
    private municipalityRepository: IMunicipalityRepository,
    private fiscalSettlementRepository: IFiscalSettlementRepository,
  ) {}

  async execute(params: GetSankeyAggregationParams): Promise<GetSankeyAggregationResult> {
    try {
      // 1. 自治体を取得
      const municipalities = await this.municipalityRepository.findBySlugs(params.slugs);

      if (municipalities.length === 0) {
        throw new Error(
          `Municipalities with slugs "${params.slugs.join(", ")}" not found`,
        );
      }

      // 2. 各自治体の決算データを取得
      const settlements = await Promise.all(
        municipalities.map((m) =>
          this.fiscalSettlementRepository.findByMunicipalityAndYear(
            m.id,
            params.financialYear,
          ),
        ),
      );

      const validSettlements = settlements.filter((s) => s !== null);

      if (validSettlements.length === 0) {
        throw new Error(
          `No settlement data found for year ${params.financialYear}`,
        );
      }

      // 3. FiscalYearSettlement → CategoryAggregation 変換
      //    複数自治体の場合は各科目を合算する
      const aggregations = validSettlements.map((s) =>
        buildCategoryAggregation(s, params.categoryType),
      );

      let rawAggregation = aggregations[0];
      for (let i = 1; i < aggregations.length; i++) {
        rawAggregation = mergeAggregations(rawAggregation, aggregations[i]);
      }

      // 4. ドメインモデルで変換処理
      const aggregation = CategoryAggregation.renameOtherCategories(rawAggregation);

      // 5. 収支差額の調整
      const totalRevenue = rawAggregation.income.reduce((s, item) => s + item.totalAmount, 0);
      const totalExpense = rawAggregation.expense.reduce((s, item) => s + item.totalAmount, 0);
      const adjusted = CategoryAggregation.adjustWithBalance(
        aggregation,
        { currentYearBalance: totalRevenue - totalExpense },
      );

      // 6. ドメインサービスでSankeyDataを構築
      const builder = new SankeyDataBuilder();
      const sankeyData = builder.build(adjusted);

      return { sankeyData };
    } catch (error) {
      throw new Error(
        `Failed to get sankey aggregation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

/**
 * 複数の CategoryAggregation を科目ごとに合算する
 */
function mergeAggregations(
  a: import("@/server/contexts/public-finance/domain/models/category-aggregation").CategoryAggregation,
  b: import("@/server/contexts/public-finance/domain/models/category-aggregation").CategoryAggregation,
): import("@/server/contexts/public-finance/domain/models/category-aggregation").CategoryAggregation {
  const mergeItems = (
    itemsA: import("@/server/contexts/public-finance/domain/models/category-aggregation").CategoryAggregationItem[],
    itemsB: import("@/server/contexts/public-finance/domain/models/category-aggregation").CategoryAggregationItem[],
  ) => {
    const map = new Map<string, number>();
    for (const item of [...itemsA, ...itemsB]) {
      const key = item.subcategory ? `${item.category}::${item.subcategory}` : item.category;
      map.set(key, (map.get(key) ?? 0) + item.totalAmount);
    }
    return Array.from(map.entries()).map(([key, totalAmount]) => {
      const [category, subcategory] = key.split("::");
      return subcategory ? { category, subcategory, totalAmount } : { category, totalAmount };
    });
  };

  return {
    income: mergeItems(a.income, b.income),
    expense: mergeItems(a.expense, b.expense),
  };
}
