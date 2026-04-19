import { FRIENDLY_LABEL_MAP } from "@/shared/accounting/account-category";
import type { SankeyData } from "@/types/sankey";
import { extractSankeyMetrics } from "@/client/lib/sankey-metrics";

interface SummaryParams {
  sankeyData: SankeyData;
  displayName: string;
  year: number;
}

/**
 * 金額を「約X兆Y億円」「約X億円」「約X,000万円」形式でフォーマットする
 */
function formatApproxAmount(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  // 万円単位に変換
  const manAmount = Math.round(absAmount / 10000);

  // 1兆円以上（1億万円以上）
  if (manAmount >= 100000000) {
    const cho = Math.floor(manAmount / 100000000);
    const oku = Math.floor((manAmount % 100000000) / 10000);
    if (oku === 0) {
      return `約${sign}${cho}兆円`;
    }
    return `約${sign}${cho}兆${oku.toLocaleString("ja-JP")}億円`;
  }

  // 1億円以上（1万万円以上）
  if (manAmount >= 10000) {
    const oku = Math.floor(manAmount / 10000);
    return `約${sign}${oku.toLocaleString("ja-JP")}億円`;
  }

  // 1億円未満
  return `約${sign}${manAmount.toLocaleString("ja-JP")}万円`;
}

/**
 * SankeyData + 自治体情報 + 年度 からサマリー文字列を生成する
 *
 * テンプレートパターンの優先度:
 * 1. カテゴリ偏り強調（最大カテゴリが40%超）
 * 2. 赤字強調（実質収支が負）
 * 3. 依存財源強調（自主財源比率が30%未満）
 * 4. 基本パターン（フォールバック）
 */
export function generateSummary(params: SummaryParams): string | null {
  const { sankeyData, displayName, year } = params;

  const metrics = extractSankeyMetrics(sankeyData);
  if (!metrics || metrics.expense === 0) {
    return null;
  }

  const friendlyCategory =
    FRIENDLY_LABEL_MAP[metrics.topExpenseCategory] ?? metrics.topExpenseCategory;
  const percentage = Math.round(metrics.topExpensePercentage);
  const expenseFormatted = formatApproxAmount(metrics.expense);
  const incomeFormatted = formatApproxAmount(metrics.income);

  // パターン1: カテゴリ偏り強調（最大カテゴリが40%超）
  if (metrics.topExpensePercentage > 40) {
    return `${displayName}の${year}年度の支出は${expenseFormatted}。「${friendlyCategory}」が全体の${percentage}%を占めています。`;
  }

  // パターン2: 赤字強調（実質収支が負）
  if (metrics.balance < 0) {
    const deficitFormatted = formatApproxAmount(Math.abs(metrics.balance));
    return `${displayName}の${year}年度は、収入${incomeFormatted}に対し支出${expenseFormatted}で、${deficitFormatted}の赤字です。`;
  }

  // パターン3: 依存財源強調（自主財源比率が30%未満）
  if (metrics.localTaxPercentage < 30) {
    const taxPercentage = Math.round(metrics.localTaxPercentage);
    return `${displayName}の${year}年度の収入は${incomeFormatted}。うち住民の税金は${taxPercentage}%で、残りは国や道からの交付金・補助金です。`;
  }

  // パターン4: 基本パターン
  return `${displayName}の${year}年度の支出は${expenseFormatted}。最も多いのは「${friendlyCategory}」（${percentage}%）です。`;
}
