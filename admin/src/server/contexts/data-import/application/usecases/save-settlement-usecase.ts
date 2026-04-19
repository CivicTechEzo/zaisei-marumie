/**
 * SaveSettlementUsecase
 *
 * プレビュー済みの決算データを FiscalYearSettlement テーブルに保存する。
 * invalid ステータスの行はスキップし、insert/update のみ処理する。
 */

import type { SettlementPreview } from "@/server/contexts/data-import/domain/models/settlement-preview";
import type { ISettlementRepository } from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";
import type { ICacheInvalidator } from "@/server/contexts/shared/domain/services/cache-invalidator.interface";

interface SaveSettlementResult {
  savedCount: number;
  skippedCount: number;
  errors: string[];
}

export class SaveSettlementUsecase {
  constructor(
    private readonly repository: ISettlementRepository,
    private readonly cacheInvalidator: ICacheInvalidator,
  ) {}

  async execute(previews: SettlementPreview[]): Promise<SaveSettlementResult> {
    // insert または update のみ対象
    const targets = previews.filter(
      (p) => (p.status === "insert" || p.status === "update") && p.municipalityId !== null,
    );
    const skipped = previews.length - targets.length;
    const errors: string[] = [];

    if (targets.length === 0) {
      return { savedCount: 0, skippedCount: skipped, errors: [] };
    }

    try {
      const savedCount = await this.repository.upsertMany(
        targets.map((p) => ({
          municipalityId: p.municipalityId as bigint,
          fiscalYear: p.fiscalYear,
          data: p.data,
          dataSource: "soumu-excel",
        })),
      );

      // webapp のキャッシュを無効化
      await this.cacheInvalidator.invalidateWebappCache();

      return { savedCount, skippedCount: skipped, errors };
    } catch (error) {
      const message = error instanceof Error ? error.message : "不明なエラーが発生しました";
      errors.push(message);
      return { savedCount: 0, skippedCount: skipped, errors };
    }
  }
}
