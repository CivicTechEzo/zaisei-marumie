/**
 * 自治体財政の歳入・歳出科目体系
 *
 * FiscalYearSettlement モデルのフィールドに対応する科目定義。
 * サンキー図やカテゴリ別集計の表示に使用する。
 *
 * - 合計フィールド（revTotal, expPurposeTotal 等）は含まない
 * - 内訳フィールド（revLocalAllocationOrdinary 等）は含まない
 * - サンキー図のノードとして表示される科目のみ定義する
 */

export interface FiscalCategory {
  /** FiscalYearSettlement のフィールド名 */
  fieldName: string;
  /** 正式名称（決算カードの科目名） */
  label: string;
  /** 短縮表示名（サンキー図ノード等） */
  shortLabel: string;
  /** UI 表示用カラーコード */
  color: string;
  /** 科目の分類 */
  type: "revenue" | "expense-purpose" | "expense-nature";
}

// ----------------------------------------------------------
// 歳入（款レベル）
// ----------------------------------------------------------

export const REVENUE_CATEGORIES: FiscalCategory[] = [
  // 自主財源
  { fieldName: "revLocalTax", label: "地方税", shortLabel: "地方税", color: "#16A34A", type: "revenue" },
  { fieldName: "revSharedBurden", label: "分担金・負担金", shortLabel: "分担金・負担金", color: "#22C55E", type: "revenue" },
  { fieldName: "revUsageFees", label: "使用料", shortLabel: "使用料", color: "#4ADE80", type: "revenue" },
  { fieldName: "revServiceFees", label: "手数料", shortLabel: "手数料", color: "#86EFAC", type: "revenue" },
  { fieldName: "revPropertyIncome", label: "財産収入", shortLabel: "財産収入", color: "#BBF7D0", type: "revenue" },
  { fieldName: "revDonations", label: "寄附金", shortLabel: "寄附金", color: "#14B8A6", type: "revenue" },
  { fieldName: "revTransfersIn", label: "繰入金", shortLabel: "繰入金", color: "#2DD4BF", type: "revenue" },
  { fieldName: "revCarryover", label: "繰越金", shortLabel: "繰越金", color: "#5EEAD4", type: "revenue" },
  { fieldName: "revMiscellaneous", label: "諸収入", shortLabel: "諸収入", color: "#99F6E4", type: "revenue" },

  // 依存財源 — 交付税・交付金
  { fieldName: "revLocalAllocationTax", label: "地方交付税", shortLabel: "地方交付税", color: "#F59E0B", type: "revenue" },
  { fieldName: "revLocalTransferTax", label: "地方譲与税", shortLabel: "地方譲与税", color: "#FBBF24", type: "revenue" },
  { fieldName: "revLocalConsumptionTax", label: "地方消費税交付金", shortLabel: "地方消費税交付金", color: "#FCD34D", type: "revenue" },
  { fieldName: "revStockTransferTax", label: "利子割交付金", shortLabel: "利子割交付金", color: "#FDE68A", type: "revenue" },
  { fieldName: "revDividendTransferTax", label: "配当割交付金", shortLabel: "配当割交付金", color: "#FEF3C7", type: "revenue" },
  { fieldName: "revCapitalGainsTransferTax", label: "株式等譲渡所得割交付金", shortLabel: "譲渡所得割交付金", color: "#FDE68A", type: "revenue" },
  { fieldName: "revGolfCourseTax", label: "ゴルフ場利用税交付金", shortLabel: "ゴルフ場利用税", color: "#D9F99D", type: "revenue" },
  { fieldName: "revEnvironmentTax", label: "環境性能割交付金", shortLabel: "環境性能割", color: "#BEF264", type: "revenue" },
  { fieldName: "revNationalPropertyTax", label: "国有提供施設等所在市町村助成交付金", shortLabel: "国有施設助成金", color: "#A3E635", type: "revenue" },
  { fieldName: "revSpecialTonnageTax", label: "地方特例交付金", shortLabel: "地方特例交付金", color: "#84CC16", type: "revenue" },
  { fieldName: "revTrafficSafetyTax", label: "交通安全対策特別交付金", shortLabel: "交通安全交付金", color: "#65A30D", type: "revenue" },

  // 依存財源 — 国・都道府県支出金
  { fieldName: "revNationalSubsidy", label: "国庫支出金", shortLabel: "国庫支出金", color: "#3B82F6", type: "revenue" },
  { fieldName: "revPrefectureSubsidy", label: "都道府県支出金", shortLabel: "道支出金", color: "#60A5FA", type: "revenue" },

  // 地方債
  { fieldName: "revLocalBond", label: "地方債", shortLabel: "地方債", color: "#EF4444", type: "revenue" },
];

// ----------------------------------------------------------
// 歳出・目的別（款レベル）
// ----------------------------------------------------------

export const EXPENSE_PURPOSE_CATEGORIES: FiscalCategory[] = [
  { fieldName: "expAssembly", label: "議会費", shortLabel: "議会費", color: "#1E3A5F", type: "expense-purpose" },
  { fieldName: "expGeneralAdmin", label: "総務費", shortLabel: "総務費", color: "#1E40AF", type: "expense-purpose" },
  { fieldName: "expWelfare", label: "民生費", shortLabel: "民生費", color: "#2563EB", type: "expense-purpose" },
  { fieldName: "expHealth", label: "衛生費", shortLabel: "衛生費", color: "#3B82F6", type: "expense-purpose" },
  { fieldName: "expLabor", label: "労働費", shortLabel: "労働費", color: "#60A5FA", type: "expense-purpose" },
  { fieldName: "expAgriculture", label: "農林水産業費", shortLabel: "農林水産業費", color: "#0E7490", type: "expense-purpose" },
  { fieldName: "expCommerce", label: "商工費", shortLabel: "商工費", color: "#0891B2", type: "expense-purpose" },
  { fieldName: "expCivilEngineering", label: "土木費", shortLabel: "土木費", color: "#06B6D4", type: "expense-purpose" },
  { fieldName: "expFirefighting", label: "消防費", shortLabel: "消防費", color: "#DC2626", type: "expense-purpose" },
  { fieldName: "expEducation", label: "教育費", shortLabel: "教育費", color: "#7C3AED", type: "expense-purpose" },
  { fieldName: "expDisasterRecovery", label: "災害復旧費", shortLabel: "災害復旧費", color: "#DB2777", type: "expense-purpose" },
  { fieldName: "expDebtService", label: "公債費", shortLabel: "公債費", color: "#9F1239", type: "expense-purpose" },
  { fieldName: "expPurposeOther", label: "その他", shortLabel: "その他", color: "#6B7280", type: "expense-purpose" },
];

// ----------------------------------------------------------
// 歳出・性質別
// ----------------------------------------------------------

export const EXPENSE_NATURE_CATEGORIES: FiscalCategory[] = [
  // 義務的経費
  { fieldName: "expPersonnel", label: "人件費", shortLabel: "人件費", color: "#B91C1C", type: "expense-nature" },
  { fieldName: "expAssistance", label: "扶助費", shortLabel: "扶助費", color: "#DC2626", type: "expense-nature" },
  { fieldName: "expDebtServiceNature", label: "公債費", shortLabel: "公債費", color: "#EF4444", type: "expense-nature" },

  // 投資的経費
  { fieldName: "expConstructionTotal", label: "普通建設事業費", shortLabel: "普通建設事業費", color: "#0369A1", type: "expense-nature" },
  { fieldName: "expDisasterRecoveryNature", label: "災害復旧事業費", shortLabel: "災害復旧事業費", color: "#0284C7", type: "expense-nature" },

  // その他の経費
  { fieldName: "expMaterials", label: "物件費", shortLabel: "物件費", color: "#7C3AED", type: "expense-nature" },
  { fieldName: "expMaintenance", label: "維持補修費", shortLabel: "維持補修費", color: "#8B5CF6", type: "expense-nature" },
  { fieldName: "expSubsidies", label: "補助費等", shortLabel: "補助費等", color: "#A78BFA", type: "expense-nature" },
  { fieldName: "expReserves", label: "積立金", shortLabel: "積立金", color: "#C084FC", type: "expense-nature" },
  { fieldName: "expInvestmentLoans", label: "投資・出資・貸付金", shortLabel: "投資等", color: "#D946EF", type: "expense-nature" },
  { fieldName: "expTransfersOut", label: "繰出金", shortLabel: "繰出金", color: "#E879F9", type: "expense-nature" },
  { fieldName: "expNatureOther", label: "その他", shortLabel: "その他", color: "#6B7280", type: "expense-nature" },
];

// ----------------------------------------------------------
// ユーティリティ
// ----------------------------------------------------------

/** 全カテゴリ（歳入 + 歳出目的別 + 歳出性質別） */
export const ALL_FISCAL_CATEGORIES: FiscalCategory[] = [
  ...REVENUE_CATEGORIES,
  ...EXPENSE_PURPOSE_CATEGORIES,
  ...EXPENSE_NATURE_CATEGORIES,
];

/** fieldName をキーとした逆引き辞書 */
export const FISCAL_CATEGORY_BY_FIELD: Record<string, FiscalCategory> =
  Object.fromEntries(ALL_FISCAL_CATEGORIES.map((c) => [c.fieldName, c]));
