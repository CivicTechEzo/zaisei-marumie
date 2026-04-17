"use client";
import "client-only";
import Image from "next/image";
import { useState } from "react";
import CardHeader from "@/client/components/layout/CardHeader";
import MainColumnCard from "@/client/components/layout/MainColumnCard";
import SankeyChart from "@/client/components/top-page/features/charts/SankeyChart";
import FinancialSummarySection from "@/client/components/top-page/features/financial-summary/FinancialSummarySection";
import SummaryCard from "@/client/components/top-page/SummaryCard";

import type { SankeyData } from "@/types/sankey";

interface CashFlowSectionProps {
  purpose?: SankeyData | null;
  nature?: SankeyData | null;
  municipalityName?: string;
  year: number;
}

export default function CashFlowSection({
  purpose,
  nature,
  municipalityName,
  year,
}: CashFlowSectionProps) {
  const [activeTab, setActiveTab] = useState<"purpose" | "nature">("purpose");

  const currentData = activeTab === "purpose" ? purpose : nature;

  return (
    <MainColumnCard id="cash-flow">
      <CardHeader
        icon={<Image src="/icons/icon-cashflow.svg" alt="Cash flow icon" width={30} height={31} />}
        municipalityName={municipalityName || "未登録の自治体"}
        title="お金の流れ"
        subtitle="どこからお金を得て、何に使っているか"
      />

      {/* ひとことサマリー */}
      <SummaryCard
        sankeyData={purpose ?? null}
        displayName={municipalityName || "未登録の自治体"}
        year={year}
      />

      {/* 財務サマリー */}
      <FinancialSummarySection sankeyData={purpose ?? null} />

      {/* タブ */}
      <div className="flex gap-7 border-b border-gray-300 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("purpose")}
          className={`pb-2 font-bold text-base border-b-2 transition-colors leading-tight cursor-pointer ${
            activeTab === "purpose"
              ? "border-[#238778] text-[#238778]"
              : "border-transparent text-[#9CA3AF] hover:text-gray-600"
          }`}
        >
          なにに使った？（目的別）
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("nature")}
          className={`pb-2 font-bold text-base border-b-2 transition-colors leading-tight cursor-pointer ${
            activeTab === "nature"
              ? "border-[#238778] text-[#238778]"
              : "border-transparent text-[#9CA3AF] hover:text-gray-600"
          }`}
        >
          どう使った？（性質別）
        </button>
      </div>

      {/* サンキー図 */}
      <div className="md:mx-0 -mx-3 mb-0">
        {currentData ? (
          <SankeyChart data={currentData} />
        ) : (
          <div className="text-gray-500 mx-4">サンキー図データが取得できませんでした</div>
        )}
      </div>
    </MainColumnCard>
  );
}
