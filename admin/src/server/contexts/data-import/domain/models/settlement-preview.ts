/**
 * 決算データプレビュー用ドメインモデル
 *
 * Excelから取得したデータをプレビュー表示用に保持する。
 * insert/update/skip/invalid のステータスと、エラー・警告を持つ。
 */

import type { ValidationError } from "@/server/contexts/data-import/domain/types/validation";

export type SettlementPreviewStatus = "insert" | "update" | "skip" | "invalid";

export interface SettlementPreviewData {
  // 歳入
  revLocalTax: bigint;
  revLocalTransferTax: bigint;
  revStockTransferTax: bigint;
  revDividendTransferTax: bigint;
  revCapitalGainsTransferTax: bigint;
  revLocalConsumptionTax: bigint;
  revGolfCourseTax: bigint;
  revEnvironmentTax: bigint;
  revNationalPropertyTax: bigint;
  revSpecialTonnageTax: bigint;
  revLocalAllocationTax: bigint;
  revLocalAllocationOrdinary: bigint;
  revLocalAllocationSpecial: bigint;
  revTrafficSafetyTax: bigint;
  revSharedBurden: bigint;
  revUsageFees: bigint;
  revServiceFees: bigint;
  revNationalSubsidy: bigint;
  revPrefectureSubsidy: bigint;
  revPropertyIncome: bigint;
  revDonations: bigint;
  revTransfersIn: bigint;
  revCarryover: bigint;
  revMiscellaneous: bigint;
  revLocalBond: bigint;
  revTotal: bigint;
  // 歳出・目的別
  expAssembly: bigint;
  expGeneralAdmin: bigint;
  expWelfare: bigint;
  expHealth: bigint;
  expLabor: bigint;
  expAgriculture: bigint;
  expCommerce: bigint;
  expCivilEngineering: bigint;
  expFirefighting: bigint;
  expEducation: bigint;
  expDisasterRecovery: bigint;
  expDebtService: bigint;
  expPurposeOther: bigint;
  expPurposeTotal: bigint;
  // 歳出・性質別
  expPersonnel: bigint;
  expPersonnelSalary: bigint;
  expAssistance: bigint;
  expDebtServiceNature: bigint;
  expMandatoryTotal: bigint;
  expMaterials: bigint;
  expMaintenance: bigint;
  expSubsidies: bigint;
  expReserves: bigint;
  expInvestmentLoans: bigint;
  expTransfersOut: bigint;
  expConstructionSubsidy: bigint;
  expConstructionIndependent: bigint;
  expConstructionTotal: bigint;
  expDisasterRecoveryNature: bigint;
  expNatureOther: bigint;
  expNatureTotal: bigint;
  // 財政指標
  fiscalPowerIndex: number;
  currentBalanceRatio: number;
  realBalanceRatio: number;
  realDebtServiceRatio: number;
  debtBurdenRatio: number;
  standardFiscalScale: bigint;
  basicFiscalRevenue: bigint;
  basicFiscalDemand: bigint;
  // ストック情報
  reserveFundTotal: bigint;
  reserveFundFiscal: bigint;
  reserveFundDebt: bigint;
  reserveFundOther: bigint;
  localBondBalance: bigint;
  // メタデータ
  population: number;
  similarGroupCode: string;
}

export interface SettlementPreview {
  municipalityCode: string;
  municipalityName: string;
  municipalityId: bigint | null;
  fiscalYear: number;
  status: SettlementPreviewStatus;
  data: SettlementPreviewData;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface SettlementPreviewSummary {
  total: number;
  insertCount: number;
  updateCount: number;
  skipCount: number;
  invalidCount: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export function computePreviewSummary(
  previews: SettlementPreview[],
): SettlementPreviewSummary {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];

  let insertCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  let invalidCount = 0;

  for (const p of previews) {
    switch (p.status) {
      case "insert":
        insertCount++;
        break;
      case "update":
        updateCount++;
        break;
      case "skip":
        skipCount++;
        break;
      case "invalid":
        invalidCount++;
        break;
    }
    allErrors.push(...p.errors);
    allWarnings.push(...p.warnings);
  }

  return {
    total: previews.length,
    insertCount,
    updateCount,
    skipCount,
    invalidCount,
    errors: allErrors,
    warnings: allWarnings,
  };
}
