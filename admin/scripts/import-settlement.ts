/**
 * CLI: 総務省決算データの一括インポート
 *
 * 使い方:
 *   pnpm settlement:import --year r06
 *   pnpm settlement:import --from h27 --to r06
 *   pnpm settlement:import --year r06 --dry-run
 */

import { PrismaClient } from "@prisma/client";
import {
  isValidFiscalYearCode,
  fiscalYearCodeToYear,
  FISCAL_YEAR_OPTIONS,
} from "../src/server/contexts/data-import/domain/models/fiscal-year-code";
import type { FiscalYearCodeString } from "../src/server/contexts/data-import/domain/models/fiscal-year-code";
import { scrapeExcelUrls } from "../src/server/contexts/data-import/infrastructure/soumu/soumu-page-scraper";
import { parseExcelFromUrl } from "../src/server/contexts/data-import/infrastructure/soumu/soumu-excel-parser";
import { mapExcelToSettlements } from "../src/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import type { ParsedExcelData } from "../src/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import { validateSettlementPreviews } from "../src/server/contexts/data-import/domain/services/settlement-validator";
import { computePreviewSummary } from "../src/server/contexts/data-import/domain/models/settlement-preview";
import { PrismaSettlementRepository } from "../src/server/contexts/data-import/infrastructure/repositories/prisma-settlement.repository";
import type { MunicipalityLookup } from "../src/server/contexts/data-import/domain/repositories/settlement-repository.interface";

function parseArgs(): {
  years: FiscalYearCodeString[];
  dryRun: boolean;
} {
  const args = process.argv.slice(2);
  let yearArg: string | undefined;
  let fromArg: string | undefined;
  let toArg: string | undefined;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--year":
        yearArg = args[++i];
        break;
      case "--from":
        fromArg = args[++i];
        break;
      case "--to":
        toArg = args[++i];
        break;
      case "--dry-run":
        dryRun = true;
        break;
    }
  }

  if (yearArg) {
    if (!isValidFiscalYearCode(yearArg)) {
      console.error(`無効な年度コード: ${yearArg}`);
      process.exit(1);
    }
    return { years: [yearArg], dryRun };
  }

  if (fromArg && toArg) {
    if (!isValidFiscalYearCode(fromArg) || !isValidFiscalYearCode(toArg)) {
      console.error(`無効な年度コード: ${fromArg} または ${toArg}`);
      process.exit(1);
    }
    const fromYear = fiscalYearCodeToYear(fromArg);
    const toYear = fiscalYearCodeToYear(toArg);
    const years = FISCAL_YEAR_OPTIONS.filter(
      (opt) => opt.fiscalYear >= fromYear && opt.fiscalYear <= toYear,
    )
      .sort((a, b) => a.fiscalYear - b.fiscalYear)
      .map((opt) => opt.code);

    if (years.length === 0) {
      console.error("指定された範囲に該当する年度がありません");
      process.exit(1);
    }
    return { years, dryRun };
  }

  console.error("使い方:");
  console.error("  --year <code>           単年度指定 (例: r06)");
  console.error("  --from <code> --to <code>  範囲指定 (例: --from h27 --to r06)");
  console.error("  --dry-run               プレビューのみ（DB書き込みなし）");
  process.exit(1);
}

async function processYear(
  yearCode: FiscalYearCodeString,
  repository: PrismaSettlementRepository,
  municipalityLookup: Map<string, MunicipalityLookup>,
  dryRun: boolean,
): Promise<void> {
  const fiscalYear = fiscalYearCodeToYear(yearCode);
  console.log(`\n${"=".repeat(60)}`);
  console.log(`${yearCode} (${fiscalYear}年度) の処理を開始...`);
  console.log("=".repeat(60));

  // 1. ExcelファイルURLを取得
  console.log("  総務省ページからExcelファイルURLを取得中...");
  const urls = await scrapeExcelUrls(yearCode);
  console.log("  ExcelファイルURL取得完了");

  // 2. Excelファイルをダウンロード・パース
  console.log("  Excelファイルをダウンロード・パース中...");
  const [surveyRows, revenueRows, expensePurposeRows, expenseNatureRows, localBondRows] =
    await Promise.all([
      parseExcelFromUrl(urls.survey),
      parseExcelFromUrl(urls.revenue),
      parseExcelFromUrl(urls.expensePurpose),
      parseExcelFromUrl(urls.expenseNature),
      parseExcelFromUrl(urls.localBond),
    ]);

  const parsed: ParsedExcelData = {
    survey: surveyRows,
    revenue: revenueRows,
    expensePurpose: expensePurposeRows,
    expenseNature: expenseNatureRows,
    localBond: localBondRows,
  };
  console.log(
    `  パース完了: 調査票${surveyRows.length}行, 歳入${revenueRows.length}行, 目的別歳出${expensePurposeRows.length}行, 性質別歳出${expenseNatureRows.length}行, 地方債${localBondRows.length}行`,
  );

  // 3. マッピング
  const rawPreviews = mapExcelToSettlements(parsed, fiscalYear, municipalityLookup);

  // 4. バリデーション
  const existing = await repository.findExistingByFiscalYear(fiscalYear);
  const previews = validateSettlementPreviews(rawPreviews, existing);
  const summary = computePreviewSummary(previews);

  console.log(
    `  プレビュー: 合計${summary.total}件 (新規${summary.insertCount}, 更新${summary.updateCount}, スキップ${summary.skipCount}, エラー${summary.invalidCount})`,
  );

  if (summary.errors.length > 0) {
    console.log(`  エラー (${summary.errors.length}件):`);
    for (const err of summary.errors) {
      console.log(`    [${err.path}] ${err.message}`);
    }
  }

  if (summary.warnings.length > 0) {
    console.log(`  警告 (${summary.warnings.length}件):`);
    for (const w of summary.warnings.slice(0, 10)) {
      console.log(`    [${w.path}] ${w.message}`);
    }
    if (summary.warnings.length > 10) {
      console.log(`    ... 他${summary.warnings.length - 10}件`);
    }
  }

  if (dryRun) {
    console.log("  [ドライラン] DB書き込みはスキップしました");
    return;
  }

  // 5. 保存
  const targets = previews.filter(
    (p) => (p.status === "insert" || p.status === "update") && p.municipalityId !== null,
  );

  if (targets.length === 0) {
    console.log("  インポート対象がありません");
    return;
  }

  console.log(`  ${targets.length}件をDBに保存中...`);
  const savedCount = await repository.upsertMany(
    targets.map((p) => ({
      municipalityId: p.municipalityId as bigint,
      fiscalYear: p.fiscalYear,
      data: p.data,
      dataSource: "soumu-excel",
    })),
  );
  console.log(`  ${savedCount}件の保存完了`);
}

async function main(): Promise<void> {
  const { years, dryRun } = parseArgs();

  console.log(`対象年度: ${years.join(", ")}`);
  if (dryRun) console.log("[ドライランモード]");

  const prisma = new PrismaClient();
  const repository = new PrismaSettlementRepository(prisma);

  try {
    // Municipality ルックアップテーブルを一度だけ構築
    const municipalities = await repository.findAllHokkaidoMunicipalities();
    const lookup = new Map(
      municipalities.map((m) => [m.municipalityCode.slice(0, 5), m]),
    );
    console.log(`北海道自治体: ${municipalities.length}件をロード`);

    for (const yearCode of years) {
      await processYear(yearCode, repository, lookup, dryRun);
    }

    console.log("\n全ての処理が完了しました");
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
