"use server";

/**
 * fetch-settlement-preview action
 *
 * 年度コードを受け取り、総務省のExcelファイルからデータを取得して
 * プレビュー結果を返すサーバーアクション。
 * 結果はin-memoryキャッシュに保持し、import action で再利用する。
 */

import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PrismaSettlementRepository } from "@/server/contexts/data-import/infrastructure/repositories/prisma-settlement.repository";
import { SoumuDataFetcher } from "@/server/contexts/data-import/infrastructure/soumu/soumu-data-fetcher";
import { PreviewSettlementUsecase } from "@/server/contexts/data-import/application/usecases/preview-settlement-usecase";
import { fetchSettlementPreviewSchema } from "@/server/contexts/data-import/presentation/schemas/import-settlement.schema";
import { setPreviewCache } from "@/server/contexts/data-import/infrastructure/cache/settlement-preview-cache";
import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";
import type { ValidationError } from "@/server/contexts/data-import/domain/types/validation";

/** BigIntをstringに変換したシリアライズ可能なプレビューデータ */
export interface SerializedSettlementPreview {
  municipalityCode: string;
  municipalityName: string;
  municipalityId: string | null;
  fiscalYear: number;
  status: "insert" | "update" | "skip" | "invalid";
  revTotal: string;
  expPurposeTotal: string;
  expNatureTotal: string;
  population: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface SerializedPreviewSummary {
  total: number;
  insertCount: number;
  updateCount: number;
  skipCount: number;
  invalidCount: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface FetchSettlementPreviewResult {
  ok: boolean;
  fiscalYear?: number;
  yearCode?: string;
  previews?: SerializedSettlementPreview[];
  summary?: SerializedPreviewSummary;
  error?: string;
}

export async function fetchSettlementPreview(
  yearCode: string,
): Promise<FetchSettlementPreviewResult> {
  "use server";

  try {
    const parsed = fetchSettlementPreviewSchema.parse({ yearCode });

    const repository = new PrismaSettlementRepository(prisma);
    const dataFetcher = new SoumuDataFetcher();
    const usecase = new PreviewSettlementUsecase(repository, dataFetcher);

    const result = await usecase.execute(parsed.yearCode as FiscalYearCodeString);

    // キャッシュに保持（import action で再利用）
    setPreviewCache(parsed.yearCode, result);

    // BigInt → string にシリアライズ
    const serializedPreviews: SerializedSettlementPreview[] = result.previews.map((p) => ({
      municipalityCode: p.municipalityCode,
      municipalityName: p.municipalityName,
      municipalityId: p.municipalityId?.toString() ?? null,
      fiscalYear: p.fiscalYear,
      status: p.status,
      revTotal: p.data.revTotal.toString(),
      expPurposeTotal: p.data.expPurposeTotal.toString(),
      expNatureTotal: p.data.expNatureTotal.toString(),
      population: p.data.population,
      errors: p.errors,
      warnings: p.warnings,
    }));

    return {
      ok: true,
      fiscalYear: result.fiscalYear,
      yearCode: result.yearCode,
      previews: serializedPreviews,
      summary: result.summary,
    };
  } catch (error) {
    console.error("Settlement preview error:", error);
    const message = error instanceof Error ? error.message : "サーバー内部エラーが発生しました";
    return { ok: false, error: message };
  }
}
