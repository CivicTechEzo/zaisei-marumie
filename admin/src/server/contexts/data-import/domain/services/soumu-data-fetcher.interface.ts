/**
 * 総務省データ取得サービスのインターフェース
 *
 * 総務省のページスクレイピングとExcelパースを抽象化する。
 * テスト時にモック注入を可能にするため、Infrastructure の具象実装から分離。
 */

import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";
import type { RawExcelRow } from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";

export interface ExcelFileUrls {
  survey: string;
  revenue: string;
  expensePurpose: string;
  expenseNature: string;
  localBond: string;
}

export interface ISoumuDataFetcher {
  scrapeExcelUrls(yearCode: FiscalYearCodeString): Promise<ExcelFileUrls>;
  parseExcelFromUrl(url: string): Promise<RawExcelRow[]>;
}
