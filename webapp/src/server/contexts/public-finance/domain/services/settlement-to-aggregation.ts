/**
 * FiscalYearSettlement -> CategoryAggregation 変換ドメインサービス
 *
 * FiscalYearSettlement のフィールド値を REVENUE_CATEGORIES / EXPENSE_PURPOSE_CATEGORIES /
 * EXPENSE_NATURE_CATEGORIES とマッピングし、CategoryAggregation を構築する。
 *
 * 金額は千円単位（DB原典）から円単位に変換する（value * 1000）。
 * 以降のパイプライン（SankeyDataBuilder, FinancialSummarySection）は円単位で統一。
 */

import type { FiscalYearSettlement } from "@/server/contexts/public-finance/domain/models/fiscal-year-settlement";
import type {
  CategoryAggregation,
  CategoryAggregationItem,
} from "@/server/contexts/public-finance/domain/models/category-aggregation";
import { SettlementAggregationMismatchWarning } from "@/server/contexts/public-finance/domain/types/errors";
import {
  REVENUE_CATEGORIES,
  EXPENSE_PURPOSE_CATEGORIES,
  EXPENSE_NATURE_CATEGORIES,
} from "@/shared/accounting/account-category";
import type { FiscalCategory } from "@/shared/accounting/account-category";

export type ExpenseDisplayMode = "purpose" | "nature";

/**
 * FiscalYearSettlement から CategoryAggregation を構築する
 *
 * @param settlement - 決算データ（千円単位）
 * @param mode - 歳出の表示モード（"purpose": 目的別, "nature": 性質別）
 * @returns CategoryAggregation（円単位）
 */
export function buildCategoryAggregation(
  settlement: FiscalYearSettlement,
  mode: ExpenseDisplayMode,
): CategoryAggregation {
  const income = categoriesToItems(REVENUE_CATEGORIES, settlement);

  const expenseCategories =
    mode === "purpose" ? EXPENSE_PURPOSE_CATEGORIES : EXPENSE_NATURE_CATEGORIES;
  const expense = categoriesToItems(expenseCategories, settlement);

  // 整合性チェック: 内訳合計と合計値の比較
  const incomeTotal = income.reduce((sum, item) => sum + item.totalAmount, 0);
  const revTotalYen = settlement.revTotal * 1000;
  if (Math.abs(incomeTotal - revTotalYen) > 1000) {
    new SettlementAggregationMismatchWarning("revenue", revTotalYen, incomeTotal).log();
  }

  const expenseTotal = expense.reduce((sum, item) => sum + item.totalAmount, 0);
  const expTotalYen =
    (mode === "purpose" ? settlement.expPurposeTotal : settlement.expNatureTotal) * 1000;
  if (Math.abs(expenseTotal - expTotalYen) > 1000) {
    new SettlementAggregationMismatchWarning("expense", expTotalYen, expenseTotal).log();
  }

  return { income, expense };
}

function categoriesToItems(
  categories: FiscalCategory[],
  settlement: FiscalYearSettlement,
): CategoryAggregationItem[] {
  const items: CategoryAggregationItem[] = [];

  for (const cat of categories) {
    const value = (settlement as unknown as Record<string, unknown>)[cat.fieldName];
    const numValue = typeof value === "number" ? value : 0;

    // 値が 0 の科目はスキップ（サンキー図のノイズ防止）
    if (numValue === 0) continue;

    // 千円 -> 円に変換
    items.push({
      category: cat.shortLabel,
      totalAmount: numValue * 1000,
    });
  }

  return items;
}
