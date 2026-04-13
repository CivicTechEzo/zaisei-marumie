/**
 * ISoumuDataFetcher の実装
 *
 * SoumuPageScraper と SoumuExcelParser を組み合わせてインターフェースを実装する。
 */

import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";
import type { RawExcelRow } from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import type {
  ISoumuDataFetcher,
  ExcelFileUrls,
} from "@/server/contexts/data-import/domain/services/soumu-data-fetcher.interface";
import { scrapeExcelUrls } from "@/server/contexts/data-import/infrastructure/soumu/soumu-page-scraper";
import { parseExcelFromUrl } from "@/server/contexts/data-import/infrastructure/soumu/soumu-excel-parser";

export class SoumuDataFetcher implements ISoumuDataFetcher {
  async scrapeExcelUrls(
    yearCode: FiscalYearCodeString,
  ): Promise<ExcelFileUrls> {
    return scrapeExcelUrls(yearCode);
  }

  async parseExcelFromUrl(url: string): Promise<RawExcelRow[]> {
    return parseExcelFromUrl(url);
  }
}
