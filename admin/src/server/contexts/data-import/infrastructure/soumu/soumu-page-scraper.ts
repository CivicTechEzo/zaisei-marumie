/**
 * SoumuPageScraper
 *
 * 総務省の年度ページHTMLをfetchし、ExcelファイルのURLを抽出する。
 * 年度コードから年度ページURLを組み立て、cheerioでHTMLをパースし、
 * 市町村決算セクションの .xlsx リンクを抽出する。
 */

import * as cheerio from "cheerio";
import type { FiscalYearCodeString } from "@/server/contexts/data-import/domain/models/fiscal-year-code";

export interface ExcelFileUrls {
  survey: string; // (1) 調査票
  revenue: string; // (2) 歳入決算額
  expensePurpose: string; // (3) 目的別歳出決算額
  expenseNature: string; // (4) 性質別歳出決算額
  localBond: string; // (5) 地方債現在高
}

const BASE_URL = "https://www.soumu.go.jp";

function buildPageUrl(yearCode: FiscalYearCodeString): string {
  return `${BASE_URL}/iken/zaisei/${yearCode}_shichouson.html`;
}

export async function scrapeExcelUrls(yearCode: FiscalYearCodeString): Promise<ExcelFileUrls> {
  const pageUrl = buildPageUrl(yearCode);

  const response = await fetch(pageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ZaiseiMarumie/1.0; +https://github.com/civictechezo/zaisei-marumie)",
    },
  });

  if (!response.ok) {
    throw new Error(`総務省ページの取得に失敗しました: ${pageUrl} (HTTP ${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // .xlsx リンクを全て抽出
  const xlsxLinks: string[] = [];
  $('a[href$=".xlsx"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const absoluteUrl = href.startsWith("http")
        ? href
        : `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
      xlsxLinks.push(absoluteUrl);
    }
  });

  // .xls リンクも対象（古い年度向け）
  $('a[href$=".xls"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href && !href.endsWith(".xlsx")) {
      const absoluteUrl = href.startsWith("http")
        ? href
        : `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
      xlsxLinks.push(absoluteUrl);
    }
  });

  if (xlsxLinks.length < 5) {
    throw new Error(
      `Excelファイルが5つ見つかりませんでした（見つかったのは${xlsxLinks.length}件）。ページ構造が変更された可能性があります: ${pageUrl}`,
    );
  }

  // 最初の5つを順番に割り当て
  // 総務省のページでは (1)調査票 (2)歳入 (3)目的別歳出 (4)性質別歳出 (5)地方債 の順にリンクが並ぶ
  return {
    survey: xlsxLinks[0],
    revenue: xlsxLinks[1],
    expensePurpose: xlsxLinks[2],
    expenseNature: xlsxLinks[3],
    localBond: xlsxLinks[4],
  };
}
