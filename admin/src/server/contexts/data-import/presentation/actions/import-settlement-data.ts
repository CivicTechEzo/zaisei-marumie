"use server";

/**
 * import-settlement-data action
 *
 * プレビュー確認後、決算データをDBに保存するサーバーアクション。
 * キャッシュされたプレビュー結果を使い、再度Excelをフェッチしない。
 * キャッシュが期限切れの場合のみ再フェッチする。
 */

import { revalidateTag } from "next/cache";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PrismaSettlementRepository } from "@/server/contexts/data-import/infrastructure/repositories/prisma-settlement.repository";
import { SoumuDataFetcher } from "@/server/contexts/data-import/infrastructure/soumu/soumu-data-fetcher";
import { WebappCacheInvalidator } from "@/server/contexts/shared/infrastructure/services/webapp-cache-invalidator";
import { PreviewSettlementUsecase } from "@/server/contexts/data-import/application/usecases/preview-settlement-usecase";
import { SaveSettlementUsecase } from "@/server/contexts/data-import/application/usecases/save-settlement-usecase";
import { fetchSettlementPreviewSchema } from "@/server/contexts/data-import/presentation/schemas/import-settlement.schema";
import {
  getPreviewCache,
  clearPreviewCache,
} from "@/server/contexts/data-import/infrastructure/cache/settlement-preview-cache";
import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";

export interface ImportSettlementResult {
  ok: boolean;
  savedCount: number;
  skippedCount: number;
  message: string;
  errors?: string[];
}

export async function importSettlementData(
  yearCode: string,
): Promise<ImportSettlementResult> {
  "use server";

  try {
    const parsed = fetchSettlementPreviewSchema.parse({ yearCode });
    const typedYearCode = parsed.yearCode as FiscalYearCodeString;

    const repository = new PrismaSettlementRepository(prisma);
    const cacheInvalidator = new WebappCacheInvalidator();
    const saveUsecase = new SaveSettlementUsecase(repository, cacheInvalidator);

    // キャッシュからプレビュー結果を取得（期限切れなら再フェッチ）
    let previewResult = getPreviewCache(typedYearCode);
    if (!previewResult) {
      const dataFetcher = new SoumuDataFetcher();
      const previewUsecase = new PreviewSettlementUsecase(
        repository,
        dataFetcher,
      );
      previewResult = await previewUsecase.execute(typedYearCode);
    }

    // invalidを除外して保存
    const saveResult = await saveUsecase.execute(previewResult.previews);

    // 使用済みキャッシュを削除
    clearPreviewCache(typedYearCode);

    if (saveResult.errors.length > 0) {
      return {
        ok: false,
        savedCount: saveResult.savedCount,
        skippedCount: saveResult.skippedCount,
        message: `エラーが発生しました: ${saveResult.errors.join(", ")}`,
        errors: saveResult.errors,
      };
    }

    // キャッシュ無効化
    revalidateTag("settlement-data", "max");

    return {
      ok: true,
      savedCount: saveResult.savedCount,
      skippedCount: saveResult.skippedCount,
      message: `${saveResult.savedCount}件の決算データをインポートしました${saveResult.skippedCount > 0 ? `（${saveResult.skippedCount}件スキップ）` : ""}`,
    };
  } catch (error) {
    console.error("Settlement import error:", error);
    const message =
      error instanceof Error ? error.message : "サーバー内部エラーが発生しました";
    return {
      ok: false,
      savedCount: 0,
      skippedCount: 0,
      message,
      errors: [message],
    };
  }
}
