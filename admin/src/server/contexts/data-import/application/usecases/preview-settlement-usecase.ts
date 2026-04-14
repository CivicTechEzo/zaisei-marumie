/**
 * PreviewSettlementUsecase
 *
 * 総務省のExcelファイルを取得・パースし、プレビュー結果を返す。
 * Scraper → Parser → Mapper → Validator の順に実行する。
 */

import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";
import { fiscalYearCodeToYear } from "@/server/contexts/data-import/domain/models/fiscal-year-code";
import type { PreviewSettlementResult } from "@/server/contexts/data-import/domain/models/settlement-preview";
import { computePreviewSummary } from "@/server/contexts/data-import/domain/models/settlement-preview";
import type { ISettlementRepository } from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";
import { mapExcelToSettlements } from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import type { ParsedExcelData } from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import { validateSettlementPreviews } from "@/server/contexts/data-import/domain/services/settlement-validator";
import type { ISoumuDataFetcher } from "@/server/contexts/data-import/domain/services/soumu-data-fetcher.interface";

export type { PreviewSettlementResult };

export class PreviewSettlementUsecase {
  constructor(
    private readonly repository: ISettlementRepository,
    private readonly dataFetcher: ISoumuDataFetcher,
  ) {}

  async execute(yearCode: FiscalYearCodeString): Promise<PreviewSettlementResult> {
    const fiscalYear = fiscalYearCodeToYear(yearCode);

    // 1. 総務省ページからExcelファイルURLを取得
    const urls = await this.dataFetcher.scrapeExcelUrls(yearCode);

    // 2. 5つのExcelファイルをダウンロード・パース（並列実行）
    const [surveyRows, revenueRows, expensePurposeRows, expenseNatureRows, localBondRows] =
      await Promise.all([
        this.dataFetcher.parseExcelFromUrl(urls.survey),
        this.dataFetcher.parseExcelFromUrl(urls.revenue),
        this.dataFetcher.parseExcelFromUrl(urls.expensePurpose),
        this.dataFetcher.parseExcelFromUrl(urls.expenseNature),
        this.dataFetcher.parseExcelFromUrl(urls.localBond),
      ]);

    const parsed: ParsedExcelData = {
      survey: surveyRows,
      revenue: revenueRows,
      expensePurpose: expensePurposeRows,
      expenseNature: expenseNatureRows,
      localBond: localBondRows,
    };

    // 3. Municipality ルックアップテーブルを構築
    const municipalities = await this.repository.findAllHokkaidoMunicipalities();
    const lookup = new Map(municipalities.map((m) => [m.municipalityCode.slice(0, 5), m]));

    // 4. Excel行 → SettlementPreview にマッピング
    const rawPreviews = mapExcelToSettlements(parsed, fiscalYear, lookup);

    // 5. バリデーション（重複チェック含む）
    const existing = await this.repository.findExistingByFiscalYear(fiscalYear);
    const validatedPreviews = validateSettlementPreviews(rawPreviews, existing);

    // 6. サマリー生成
    const summary = computePreviewSummary(validatedPreviews);

    return {
      fiscalYear,
      yearCode,
      previews: validatedPreviews,
      summary,
    };
  }
}
