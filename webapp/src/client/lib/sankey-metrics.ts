import type { SankeyData } from "@/types/sankey";

interface SankeyMetrics {
  /** 歳入総額 */
  income: number;
  /** 歳出総額 */
  expense: number;
  /** 実質収支（歳入 - 歳出） */
  balance: number;
  /** 最大歳出カテゴリ名 */
  topExpenseCategory: string;
  /** 最大歳出カテゴリ金額 */
  topExpenseAmount: number;
  /** 最大歳出カテゴリの割合（%） */
  topExpensePercentage: number;
  /** 地方税額 */
  localTaxAmount: number;
  /** 自主財源比率（%） */
  localTaxPercentage: number;
}

/**
 * SankeyData からメトリクスを抽出する共通関数
 *
 * FinancialSummarySection と SummaryCard の両方で使用する。
 */
export function extractSankeyMetrics(sankeyData: SankeyData): SankeyMetrics | null {
  const { nodes, links } = sankeyData;
  if (!nodes?.length || !links?.length) {
    return null;
  }

  // 「合計」ノードを特定
  const totalNode = nodes.find((n) => n.label === "合計");
  if (!totalNode) {
    return null;
  }

  // 歳入総額: 「合計」ノードへの流入合計
  const income = links
    .filter((link) => link.target === totalNode.id)
    .reduce((sum, link) => sum + link.value, 0);

  // 「(仕訳中)」ノードを特定
  const pendingNode = nodes.find((n) => n.label === "(仕訳中)");

  // 歳出リンク: 「合計」ノードからの流出のうち「(仕訳中)」を除く
  const expenseLinks = links.filter(
    (link) => link.source === totalNode.id && (!pendingNode || link.target !== pendingNode.id),
  );

  // 歳出総額
  const expense = expenseLinks.reduce((sum, link) => sum + link.value, 0);

  // 最大歳出カテゴリ
  let topExpenseCategory = "";
  let topExpenseAmount = 0;
  for (const link of expenseLinks) {
    if (link.value > topExpenseAmount) {
      topExpenseAmount = link.value;
      const targetNode = nodes.find((n) => n.id === link.target);
      topExpenseCategory = targetNode?.label ?? "";
    }
  }

  const topExpensePercentage = expense > 0 ? (topExpenseAmount / expense) * 100 : 0;

  // 地方税額: 「地方税」ノードから「合計」ノードへのリンク
  const localTaxNode = nodes.find((n) => n.label === "地方税");
  const localTaxAmount = localTaxNode
    ? links
        .filter((link) => link.source === localTaxNode.id && link.target === totalNode.id)
        .reduce((sum, link) => sum + link.value, 0)
    : 0;

  const localTaxPercentage = income > 0 ? (localTaxAmount / income) * 100 : 0;

  // 実質収支
  const balance = income - expense;

  return {
    income,
    expense,
    balance,
    topExpenseCategory,
    topExpenseAmount,
    topExpensePercentage,
    localTaxAmount,
    localTaxPercentage,
  };
}
