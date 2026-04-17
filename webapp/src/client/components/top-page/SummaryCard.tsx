"use client";

import { generateSummary } from "@/client/lib/summary-template";
import type { SankeyData } from "@/types/sankey";

interface SummaryCardProps {
  sankeyData: SankeyData | null;
  displayName: string;
  year: number;
}

export default function SummaryCard({ sankeyData, displayName, year }: SummaryCardProps) {
  if (!sankeyData) {
    return null;
  }

  const summary = generateSummary({ sankeyData, displayName, year });
  if (!summary) {
    return null;
  }

  return (
    <div className="bg-emerald-50 rounded-lg p-4 mb-4">
      <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
    </div>
  );
}
