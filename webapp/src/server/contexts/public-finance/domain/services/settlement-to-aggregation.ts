/**
 * FiscalYearSettlement → CategoryAggregation 変換ドメインサービス
 *
 * FiscalYearSettlement のフィールド値を REVENUE_CATEGORIES / EXPENSE_PURPOSE_CATEGORIES /
 * EXPENSE_NATURE_CATEGORIES とマッピングし、CategoryAggregation を構築する。
 */

import type { FiscalYearSettlement } from "@prisma/client";
import type {
  CategoryAggregation,
  CategoryAggregationItem,
} from "@/server/contexts/public-finance/domain/models/category-aggregation";
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
 * @param settlement - 決算データ
 * @param mode - 歳出の表示モード（"purpose": 目的別, "nature": 性質別）
 */
export function buildCategoryAggregation(
  settlement: FiscalYearSettlement,
  mode: ExpenseDisplayMode,
): CategoryAggregation {
  const income = categoriesToItems(REVENUE_CATEGORIES, settlement);

  const expenseCategories =
    mode === "purpose" ? EXPENSE_PURPOSE_CATEGORIES : EXPENSE_NATURE_CATEGORIES;
  const expense = categoriesToItems(expenseCategories, settlement);

  return { income, expense };
}

function categoriesToItems(
  categories: FiscalCategory[],
  settlement: FiscalYearSettlement,
): CategoryAggregationItem[] {
  const items: CategoryAggregationItem[] = [];

  for (const cat of categories) {
    const raw = (settlement as unknown as Record<string, unknown>)[cat.fieldName];
    const value = typeof raw === "bigint" ? Number(raw) : 0;

    // 値が 0 の科目はスキップ（サンキー図のノイズ防止）
    if (value === 0) continue;

    items.push({
      category: cat.shortLabel,
      totalAmount: value,
    });
  }

  return items;
}
