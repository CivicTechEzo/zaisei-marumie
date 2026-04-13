"use server";

/**
 * import-settlement-data action
 *
 * プレビュー確認後、決算データをDBに保存するサーバーアクション。
 * プレビュー時と同じ年度コードを受け取り、再度Excelを取得して保存する。
 */

import { revalidateTag } from "next/cache";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PrismaSettlementRepository } from "@/server/contexts/data-import/infrastructure/repositories/prisma-settlement.repository";
import { WebappCacheInvalidator } from "@/server/contexts/shared/infrastructure/services/webapp-cache-invalidator";
import { PreviewSettlementUsecase } from "@/server/contexts/data-import/application/usecases/preview-settlement-usecase";
import { SaveSettlementUsecase } from "@/server/contexts/data-import/application/usecases/save-settlement-usecase";
import { fetchSettlementPreviewSchema } from "@/server/contexts/data-import/presentation/schemas/import-settlement.schema";
import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";

export interface ImportSettlementResult {
  ok: boolean;
  savedCount: number;
  skippedCount: number;
  message: string;
  errors?: string[];
}

const repository = new PrismaSettlementRepository(prisma);
const cacheInvalidator = new WebappCacheInvalidator();
const previewUsecase = new PreviewSettlementUsecase(repository);
const saveUsecase = new SaveSettlementUsecase(repository, cacheInvalidator);

export async function importSettlementData(
  yearCode: string,
): Promise<ImportSettlementResult> {
  "use server";

  try {
    const parsed = fetchSettlementPreviewSchema.parse({ yearCode });

    // 再度Excelを取得してプレビュー生成（最新データで保存するため）
    const previewResult = await previewUsecase.execute(
      parsed.yearCode as FiscalYearCodeString,
    );

    // invalidを除外して保存
    const saveResult = await saveUsecase.execute(previewResult.previews);

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
    revalidateTag("settlement-data");

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
