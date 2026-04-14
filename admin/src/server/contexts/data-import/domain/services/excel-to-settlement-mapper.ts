/**
 * ExcelToSettlementMapper
 *
 * パースされたExcel行データを SettlementPreviewData にマッピングする。
 * 5つのExcelファイル（調査票・歳入・目的別歳出・性質別歳出・地方債）から
 * 団体コード（5桁）をキーにデータを統合する。
 */

import type { ValidationError } from "@/server/contexts/data-import/domain/types/validation";
import type {
  SettlementPreview,
  SettlementPreviewData,
} from "@/server/contexts/data-import/domain/models/settlement-preview";
import type { MunicipalityLookup } from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";

/** Excelパース後の生データ行（各ファイルから取得） */
export interface RawExcelRow {
  [key: string]: string | number | undefined;
}

/** 5ファイル分のパース結果 */
export interface ParsedExcelData {
  survey: RawExcelRow[]; // (1) 調査票
  revenue: RawExcelRow[]; // (2) 歳入決算額
  expensePurpose: RawExcelRow[]; // (3) 目的別歳出決算額
  expenseNature: RawExcelRow[]; // (4) 性質別歳出決算額
  localBond: RawExcelRow[]; // (5) 地方債現在高
}

// -------------------------------------------------------------------
// Excel列名 → SettlementPreviewData フィールドのマッピング定義
// -------------------------------------------------------------------

/** 歳入マッピング（Excel列名 → フィールド名） */
const REVENUE_COLUMN_MAP: Record<string, keyof SettlementPreviewData> = {
  地方税: "revLocalTax",
  地方譲与税: "revLocalTransferTax",
  利子割交付金: "revStockTransferTax",
  配当割交付金: "revDividendTransferTax",
  株式等譲渡所得割交付金: "revCapitalGainsTransferTax",
  地方消費税交付金: "revLocalConsumptionTax",
  ゴルフ場利用税交付金: "revGolfCourseTax",
  環境性能割交付金: "revEnvironmentTax",
  国有提供施設等所在市町村助成交付金: "revNationalPropertyTax",
  地方特例交付金: "revSpecialTonnageTax",
  "地方交付税　計": "revLocalAllocationTax",
  "地方交付税　普通": "revLocalAllocationOrdinary",
  "地方交付税　特別": "revLocalAllocationSpecial",
  交通安全対策特別交付金: "revTrafficSafetyTax",
  分担金及び負担金: "revSharedBurden",
  使用料: "revUsageFees",
  手数料: "revServiceFees",
  国庫支出金: "revNationalSubsidy",
  都道府県支出金: "revPrefectureSubsidy",
  財産収入: "revPropertyIncome",
  寄附金: "revDonations",
  繰入金: "revTransfersIn",
  繰越金: "revCarryover",
  諸収入: "revMiscellaneous",
  地方債: "revLocalBond",
  歳入合計: "revTotal",
};

/** 目的別歳出マッピング */
const EXPENSE_PURPOSE_COLUMN_MAP: Record<string, keyof SettlementPreviewData> = {
  議会費: "expAssembly",
  総務費: "expGeneralAdmin",
  民生費: "expWelfare",
  衛生費: "expHealth",
  労働費: "expLabor",
  農林水産業費: "expAgriculture",
  商工費: "expCommerce",
  土木費: "expCivilEngineering",
  消防費: "expFirefighting",
  教育費: "expEducation",
  災害復旧費: "expDisasterRecovery",
  公債費: "expDebtService",
  歳出合計: "expPurposeTotal",
};

/** 性質別歳出マッピング */
const EXPENSE_NATURE_COLUMN_MAP: Record<string, keyof SettlementPreviewData> = {
  人件費: "expPersonnel",
  うち職員給: "expPersonnelSalary",
  扶助費: "expAssistance",
  公債費_性質別: "expDebtServiceNature",
  義務的経費計: "expMandatoryTotal",
  物件費: "expMaterials",
  維持補修費: "expMaintenance",
  補助費等: "expSubsidies",
  積立金: "expReserves",
  投資及び出資金: "expInvestmentLoans",
  繰出金: "expTransfersOut",
  普通建設事業費_補助: "expConstructionSubsidy",
  普通建設事業費_単独: "expConstructionIndependent",
  普通建設事業費_計: "expConstructionTotal",
  災害復旧事業費_性質別: "expDisasterRecoveryNature",
  歳出合計: "expNatureTotal",
};

/** 調査票マッピング（財政指標・ストック情報・メタデータ） */
const SURVEY_COLUMN_MAP: Record<string, keyof SettlementPreviewData> = {
  財政力指数: "fiscalPowerIndex",
  経常収支比率: "currentBalanceRatio",
  実質収支比率: "realBalanceRatio",
  実質公債費比率: "realDebtServiceRatio",
  公債費負担比率: "debtBurdenRatio",
  標準財政規模: "standardFiscalScale",
  基準財政収入額: "basicFiscalRevenue",
  基準財政需要額: "basicFiscalDemand",
  "積立金現在高　計": "reserveFundTotal",
  財政調整基金: "reserveFundFiscal",
  減債基金: "reserveFundDebt",
  その他特定目的基金: "reserveFundOther",
  地方債現在高: "localBondBalance",
  人口: "population",
  類似団体区分: "similarGroupCode",
};

/** 数値フィールドかDecimal（財政指標）フィールドか */
const DECIMAL_FIELDS: Set<keyof SettlementPreviewData> = new Set([
  "fiscalPowerIndex",
  "currentBalanceRatio",
  "realBalanceRatio",
  "realDebtServiceRatio",
  "debtBurdenRatio",
]);

const INT_FIELDS: Set<keyof SettlementPreviewData> = new Set(["population"]);

const STRING_FIELDS: Set<keyof SettlementPreviewData> = new Set(["similarGroupCode"]);

// -------------------------------------------------------------------
// 団体コード列名の候補
// -------------------------------------------------------------------
const CODE_COLUMN_CANDIDATES = ["団体コード", "団体ｺｰﾄﾞ", "コード"];
const NAME_COLUMN_CANDIDATES = ["団体名", "市町村名", "自治体名"];

function findColumnValue(row: RawExcelRow, candidates: string[]): string | undefined {
  for (const key of candidates) {
    if (row[key] !== undefined) return String(row[key]);
  }
  // 部分一致も試す
  for (const rowKey of Object.keys(row)) {
    for (const candidate of candidates) {
      if (rowKey.includes(candidate)) return String(row[rowKey]);
    }
  }
  return undefined;
}

function getOrgCode(row: RawExcelRow): string | undefined {
  return findColumnValue(row, CODE_COLUMN_CANDIDATES);
}

function getOrgName(row: RawExcelRow): string | undefined {
  return findColumnValue(row, NAME_COLUMN_CANDIDATES);
}

// -------------------------------------------------------------------
// 値変換ヘルパー
// -------------------------------------------------------------------

function toBigInt(value: string | number | undefined): bigint {
  if (value === undefined || value === "" || value === "-") return 0n;
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(num)) return 0n;
  return BigInt(Math.round(num));
}

function toDecimal(value: string | number | undefined): number {
  if (value === undefined || value === "" || value === "-") return 0;
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

function toInt(value: string | number | undefined): number {
  if (value === undefined || value === "" || value === "-") return 0;
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(num) ? 0 : Math.round(num);
}

// -------------------------------------------------------------------
// メインのマッピング関数
// -------------------------------------------------------------------

function createEmptyData(): SettlementPreviewData {
  return {
    revLocalTax: 0n,
    revLocalTransferTax: 0n,
    revStockTransferTax: 0n,
    revDividendTransferTax: 0n,
    revCapitalGainsTransferTax: 0n,
    revLocalConsumptionTax: 0n,
    revGolfCourseTax: 0n,
    revEnvironmentTax: 0n,
    revNationalPropertyTax: 0n,
    revSpecialTonnageTax: 0n,
    revLocalAllocationTax: 0n,
    revLocalAllocationOrdinary: 0n,
    revLocalAllocationSpecial: 0n,
    revTrafficSafetyTax: 0n,
    revSharedBurden: 0n,
    revUsageFees: 0n,
    revServiceFees: 0n,
    revNationalSubsidy: 0n,
    revPrefectureSubsidy: 0n,
    revPropertyIncome: 0n,
    revDonations: 0n,
    revTransfersIn: 0n,
    revCarryover: 0n,
    revMiscellaneous: 0n,
    revLocalBond: 0n,
    revTotal: 0n,
    expAssembly: 0n,
    expGeneralAdmin: 0n,
    expWelfare: 0n,
    expHealth: 0n,
    expLabor: 0n,
    expAgriculture: 0n,
    expCommerce: 0n,
    expCivilEngineering: 0n,
    expFirefighting: 0n,
    expEducation: 0n,
    expDisasterRecovery: 0n,
    expDebtService: 0n,
    expPurposeOther: 0n,
    expPurposeTotal: 0n,
    expPersonnel: 0n,
    expPersonnelSalary: 0n,
    expAssistance: 0n,
    expDebtServiceNature: 0n,
    expMandatoryTotal: 0n,
    expMaterials: 0n,
    expMaintenance: 0n,
    expSubsidies: 0n,
    expReserves: 0n,
    expInvestmentLoans: 0n,
    expTransfersOut: 0n,
    expConstructionSubsidy: 0n,
    expConstructionIndependent: 0n,
    expConstructionTotal: 0n,
    expDisasterRecoveryNature: 0n,
    expNatureOther: 0n,
    expNatureTotal: 0n,
    fiscalPowerIndex: 0,
    currentBalanceRatio: 0,
    realBalanceRatio: 0,
    realDebtServiceRatio: 0,
    debtBurdenRatio: 0,
    standardFiscalScale: 0n,
    basicFiscalRevenue: 0n,
    basicFiscalDemand: 0n,
    reserveFundTotal: 0n,
    reserveFundFiscal: 0n,
    reserveFundDebt: 0n,
    reserveFundOther: 0n,
    localBondBalance: 0n,
    population: 0,
    similarGroupCode: "",
  };
}

function applyColumnMap(
  data: SettlementPreviewData,
  row: RawExcelRow,
  columnMap: Record<string, keyof SettlementPreviewData>,
  _warnings: ValidationError[],
  _municipalityName: string,
): void {
  for (const [excelCol, field] of Object.entries(columnMap)) {
    // Excel列名を行データから検索（完全一致 or 部分一致）
    let value = row[excelCol];
    if (value === undefined) {
      // 部分一致で探す
      for (const key of Object.keys(row)) {
        if (key.includes(excelCol) || excelCol.includes(key)) {
          value = row[key];
          break;
        }
      }
    }

    if (value === undefined) continue;

    if (STRING_FIELDS.has(field)) {
      (data as unknown as Record<string, unknown>)[field] = String(value);
    } else if (DECIMAL_FIELDS.has(field)) {
      (data as unknown as Record<string, unknown>)[field] = toDecimal(value);
    } else if (INT_FIELDS.has(field)) {
      (data as unknown as Record<string, unknown>)[field] = toInt(value);
    } else {
      (data as unknown as Record<string, unknown>)[field] = toBigInt(value);
    }
  }
}

/**
 * 5つのExcelデータを統合し、北海道自治体分のSettlementPreview配列を生成する
 */
export function mapExcelToSettlements(
  parsed: ParsedExcelData,
  fiscalYear: number,
  municipalityLookup: Map<string, MunicipalityLookup>,
): SettlementPreview[] {
  // 全ファイルから北海道の団体コードを収集
  const allCodes = new Set<string>();
  const allRows: Record<
    string,
    {
      survey?: RawExcelRow;
      revenue?: RawExcelRow;
      expensePurpose?: RawExcelRow;
      expenseNature?: RawExcelRow;
      localBond?: RawExcelRow;
      name?: string;
    }
  > = {};

  function collectRows(rows: RawExcelRow[], fileKey: keyof ParsedExcelData): void {
    for (const row of rows) {
      const code = getOrgCode(row);
      if (!code) continue;
      // 5桁にパディング
      const code5 = code.padStart(5, "0");
      if (!code5.startsWith("01")) continue;

      allCodes.add(code5);
      if (!allRows[code5]) allRows[code5] = {};
      allRows[code5][fileKey] = row;

      const name = getOrgName(row);
      if (name && !allRows[code5].name) {
        allRows[code5].name = name;
      }
    }
  }

  collectRows(parsed.survey, "survey");
  collectRows(parsed.revenue, "revenue");
  collectRows(parsed.expensePurpose, "expensePurpose");
  collectRows(parsed.expenseNature, "expenseNature");
  collectRows(parsed.localBond, "localBond");

  const previews: SettlementPreview[] = [];

  for (const code5 of allCodes) {
    const rows = allRows[code5];
    const warnings: ValidationError[] = [];
    const errors: ValidationError[] = [];

    // 団体コード5桁 → Municipality ルックアップ
    const municipality = municipalityLookup.get(code5);
    const municipalityName = rows.name ?? municipality?.displayName ?? code5;

    if (!municipality) {
      errors.push({
        path: `${municipalityName}.municipalityCode`,
        code: "IMPORT_MUNICIPALITY_NOT_FOUND",
        message: `団体コード ${code5} に対応する自治体がMunicipalityテーブルに未登録です`,
        severity: "error",
      });
    }

    const data = createEmptyData();

    // (1) 調査票
    if (rows.survey) {
      applyColumnMap(data, rows.survey, SURVEY_COLUMN_MAP, warnings, municipalityName);
    }

    // (2) 歳入
    if (rows.revenue) {
      applyColumnMap(data, rows.revenue, REVENUE_COLUMN_MAP, warnings, municipalityName);
    }

    // (3) 目的別歳出
    if (rows.expensePurpose) {
      applyColumnMap(
        data,
        rows.expensePurpose,
        EXPENSE_PURPOSE_COLUMN_MAP,
        warnings,
        municipalityName,
      );
      // 「その他」は合計 - 各款合計で算出
      const knownTotal =
        data.expAssembly +
        data.expGeneralAdmin +
        data.expWelfare +
        data.expHealth +
        data.expLabor +
        data.expAgriculture +
        data.expCommerce +
        data.expCivilEngineering +
        data.expFirefighting +
        data.expEducation +
        data.expDisasterRecovery +
        data.expDebtService;
      if (data.expPurposeTotal > 0n) {
        data.expPurposeOther = data.expPurposeTotal - knownTotal;
      }
    }

    // (4) 性質別歳出
    if (rows.expenseNature) {
      applyColumnMap(
        data,
        rows.expenseNature,
        EXPENSE_NATURE_COLUMN_MAP,
        warnings,
        municipalityName,
      );
      // 「その他」は合計 - 既知項目
      const knownNature =
        data.expPersonnel +
        data.expAssistance +
        data.expDebtServiceNature +
        data.expMaterials +
        data.expMaintenance +
        data.expSubsidies +
        data.expReserves +
        data.expInvestmentLoans +
        data.expTransfersOut +
        data.expConstructionTotal +
        data.expDisasterRecoveryNature;
      if (data.expNatureTotal > 0n) {
        data.expNatureOther = data.expNatureTotal - knownNature;
      }
    }

    // (5) 地方債現在高（補完用）
    if (rows.localBond) {
      const bondRow = rows.localBond;
      const bondValue = findColumnValue(bondRow, ["地方債現在高", "現在高", "計"]);
      if (bondValue !== undefined && data.localBondBalance === 0n) {
        data.localBondBalance = toBigInt(bondValue);
      }
    }

    previews.push({
      municipalityCode: code5,
      municipalityName,
      municipalityId: municipality?.id ?? null,
      fiscalYear,
      status: errors.length > 0 ? "invalid" : "insert",
      data,
      errors,
      warnings,
    });
  }

  return previews;
}
