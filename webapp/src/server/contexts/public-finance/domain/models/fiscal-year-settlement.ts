/**
 * 決算データドメインモデル
 *
 * FiscalYearSettlement の Prisma モデルからドメイン層用に変換した型。
 * - BigInt フィールドは number に変換（千円単位のため JavaScript Number 安全整数範囲内）
 * - Decimal フィールドは number に変換
 * - 金額は千円単位のまま保持（円単位への変換は集計サービスで行う）
 */
export interface FiscalYearSettlement {
  id: number;
  municipalityId: number;
  fiscalYear: number;

  // ----------------------------------------------------------
  // 歳入（款レベル） — 単位: 千円
  // ----------------------------------------------------------
  revLocalTax: number;
  revLocalTransferTax: number;
  revStockTransferTax: number;
  revDividendTransferTax: number;
  revCapitalGainsTransferTax: number;
  revLocalConsumptionTax: number;
  revGolfCourseTax: number;
  revEnvironmentTax: number;
  revNationalPropertyTax: number;
  revSpecialTonnageTax: number;
  revLocalAllocationTax: number;
  revLocalAllocationOrdinary: number;
  revLocalAllocationSpecial: number;
  revTrafficSafetyTax: number;
  revSharedBurden: number;
  revUsageFees: number;
  revServiceFees: number;
  revNationalSubsidy: number;
  revPrefectureSubsidy: number;
  revPropertyIncome: number;
  revDonations: number;
  revTransfersIn: number;
  revCarryover: number;
  revMiscellaneous: number;
  revLocalBond: number;
  revTotal: number;

  // ----------------------------------------------------------
  // 歳出・目的別（款レベル） — 単位: 千円
  // ----------------------------------------------------------
  expAssembly: number;
  expGeneralAdmin: number;
  expWelfare: number;
  expHealth: number;
  expLabor: number;
  expAgriculture: number;
  expCommerce: number;
  expCivilEngineering: number;
  expFirefighting: number;
  expEducation: number;
  expDisasterRecovery: number;
  expDebtService: number;
  expPurposeOther: number;
  expPurposeTotal: number;

  // ----------------------------------------------------------
  // 歳出・性質別 — 単位: 千円
  // ----------------------------------------------------------
  expPersonnel: number;
  expPersonnelSalary: number;
  expAssistance: number;
  expDebtServiceNature: number;
  expMandatoryTotal: number;
  expMaterials: number;
  expMaintenance: number;
  expSubsidies: number;
  expReserves: number;
  expInvestmentLoans: number;
  expTransfersOut: number;
  expConstructionSubsidy: number;
  expConstructionIndependent: number;
  expConstructionTotal: number;
  expDisasterRecoveryNature: number;
  expNatureOther: number;
  expNatureTotal: number;

  // ----------------------------------------------------------
  // 財政指標
  // ----------------------------------------------------------
  fiscalPowerIndex: number;
  currentBalanceRatio: number;
  realBalanceRatio: number;
  realDebtServiceRatio: number;
  debtBurdenRatio: number;
  standardFiscalScale: number;
  basicFiscalRevenue: number;
  basicFiscalDemand: number;

  // ----------------------------------------------------------
  // ストック情報 — 単位: 千円
  // ----------------------------------------------------------
  reserveFundTotal: number;
  reserveFundFiscal: number;
  reserveFundDebt: number;
  reserveFundOther: number;
  localBondBalance: number;

  // ----------------------------------------------------------
  // メタデータ
  // ----------------------------------------------------------
  population: number;
  similarGroupCode: string;
  dataSource: string;

  // ----------------------------------------------------------
  // タイムスタンプ
  // ----------------------------------------------------------
  updatedAt: Date;
}
