import { formatAmount } from "@/client/lib/financial-calculator";
import type { SankeyData } from "@/types/sankey";
import FinancialSummaryCard from "./FinancialSummaryCard";

interface FinancialSummarySectionProps {
  sankeyData: SankeyData | null;
}

/**
 * sankeyDataから財務データを計算する
 *
 * - 歳入総額: 「合計」ノードへの流入合計
 * - 歳出総額: 「合計」ノードからの流出合計のうち、「(仕訳中)」を除いた合計
 * - 実質収支: 歳入総額 - 歳出総額
 */
function calculateFinancialData(sankeyData: SankeyData | null) {
  if (!sankeyData?.links || !sankeyData?.nodes) {
    return { income: 0, expense: 0, balance: 0 };
  }

  const { nodes, links } = sankeyData;

  // 「合計」ノードを特定
  const totalNode = nodes.find((n) => n.label === "合計");
  if (!totalNode) {
    return { income: 0, expense: 0, balance: 0 };
  }

  // 歳入総額: 「合計」ノードへの流入合計
  const income = links
    .filter((link) => link.target === totalNode.id)
    .reduce((sum, link) => sum + link.value, 0);

  // 「(仕訳中)」ノードを特定
  const pendingNode = nodes.find((n) => n.label === "(仕訳中)");

  // 歳出総額: 「合計」ノードからの流出合計のうち、「(仕訳中)」を除く
  const expense = links
    .filter(
      (link) => link.source === totalNode.id && (!pendingNode || link.target !== pendingNode.id),
    )
    .reduce((sum, link) => sum + link.value, 0);

  // 実質収支
  const balance = income - expense;

  return { income, expense, balance };
}

export default function FinancialSummarySection({ sankeyData }: FinancialSummarySectionProps) {
  const { income, expense, balance } = calculateFinancialData(sankeyData);

  const isPositiveBalance = balance >= 0;
  const balanceColor = isPositiveBalance ? "#238778" : "#DC2626";

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <FinancialSummaryCard
        className="w-full md:flex-1"
        title="歳入総額"
        amount={formatAmount(income)}
        titleColor="#238778"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="w-full md:flex-1"
        title="歳出総額"
        amount={formatAmount(expense)}
        titleColor="#DC2626"
        amountColor="#1F2937"
      />

      <FinancialSummaryCard
        className="w-full md:flex-1"
        title="実質収支"
        amount={formatAmount(balance)}
        titleColor={balanceColor}
        amountColor={balanceColor}
      />
    </div>
  );
}
