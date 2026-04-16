import { formatAmount } from "@/client/lib/financial-calculator";
import { extractSankeyMetrics } from "@/client/lib/sankey-metrics";
import type { SankeyData } from "@/types/sankey";
import FinancialSummaryCard from "./FinancialSummaryCard";

interface FinancialSummarySectionProps {
  sankeyData: SankeyData | null;
}

export default function FinancialSummarySection({ sankeyData }: FinancialSummarySectionProps) {
  const metrics = sankeyData ? extractSankeyMetrics(sankeyData) : null;
  const income = metrics?.income ?? 0;
  const expense = metrics?.expense ?? 0;
  const balance = metrics?.balance ?? 0;

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
