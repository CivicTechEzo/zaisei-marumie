/**
 * SoumuExcelParser
 *
 * Excelファイルをダウンロードしてパースし、生データの行配列を返す。
 * xlsxライブラリ（SheetJS）を使用。
 * ヘッダー行の位置を自動検出し、北海道（団体コード01始まり）のみ抽出する。
 */

import * as XLSX from "xlsx";
import type { RawExcelRow } from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";

/** 団体コード列を検出するための候補 */
const CODE_HEADER_CANDIDATES = ["団体コード", "団体ｺｰﾄﾞ", "コード"];

/**
 * ExcelファイルのURLからデータを取得し、パースして行データ配列を返す。
 * 北海道（団体コード01始まり）のみフィルタ済み。
 */
export async function parseExcelFromUrl(url: string): Promise<RawExcelRow[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ZaiseiMarumie/1.0; +https://github.com/civictechezo/zaisei-marumie)",
    },
  });

  if (!response.ok) {
    throw new Error(`Excelファイルのダウンロードに失敗しました: ${url} (HTTP ${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });

  // 最初のシートを使用
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Excelファイルにシートがありません: ${url}`);
  }

  return parseSheet(sheet);
}

/**
 * Excelバッファからパースする（CLIスクリプト・アップロードAPI用）
 * @public
 */
export async function parseExcelFromBuffer(buffer: Buffer): Promise<RawExcelRow[]> {
  const data = new Uint8Array(buffer);
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error("Excelファイルにシートがありません");
  }

  return parseSheet(sheet);
}

function parseSheet(sheet: XLSX.WorkSheet): RawExcelRow[] {
  // シート全体をJSON配列として取得（ヘッダーなし、全行）
  const rawRows: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: undefined,
    blankrows: false,
  });

  // ヘッダー行を検出（「団体コード」列を探す）
  let headerRowIndex = -1;
  let codeColIndex = -1;
  let headers: string[] = [];

  for (let i = 0; i < Math.min(rawRows.length, 20); i++) {
    const row = rawRows[i];
    if (!row) continue;

    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] ?? "").trim();
      if (CODE_HEADER_CANDIDATES.some((c) => cell.includes(c))) {
        headerRowIndex = i;
        codeColIndex = j;
        headers = row.map((c) => String(c ?? "").trim());
        break;
      }
    }
    if (headerRowIndex >= 0) break;
  }

  if (headerRowIndex < 0 || codeColIndex < 0) {
    throw new Error("ヘッダー行が検出できません（「団体コード」列が見つかりません）");
  }

  // データ行を処理（ヘッダー行の次の行から）
  const result: RawExcelRow[] = [];

  for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row) continue;

    // 団体コードの取得
    const codeValue = row[codeColIndex];
    if (codeValue === undefined || codeValue === "") continue;

    const codeStr = String(codeValue).trim().padStart(5, "0");

    // 北海道フィルタ: 01で始まる行のみ
    if (!codeStr.startsWith("01")) continue;

    // ヘッダー名をキーとしたオブジェクトに変換
    const rowObj: RawExcelRow = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      if (header) {
        rowObj[header] = row[j];
      }
    }

    result.push(rowObj);
  }

  return result;
}
