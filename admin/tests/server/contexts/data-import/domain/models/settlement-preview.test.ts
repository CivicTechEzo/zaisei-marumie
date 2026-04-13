import {
  computePreviewSummary,
} from "@/server/contexts/data-import/domain/models/settlement-preview";
import type { SettlementPreview } from "@/server/contexts/data-import/domain/models/settlement-preview";

function createMockPreview(
  overrides: Partial<SettlementPreview> = {},
): SettlementPreview {
  return {
    municipalityCode: "01100",
    municipalityName: "札幌市",
    municipalityId: 1n,
    fiscalYear: 2024,
    status: "insert",
    data: {
      revLocalTax: 0n, revLocalTransferTax: 0n, revStockTransferTax: 0n,
      revDividendTransferTax: 0n, revCapitalGainsTransferTax: 0n,
      revLocalConsumptionTax: 0n, revGolfCourseTax: 0n, revEnvironmentTax: 0n,
      revNationalPropertyTax: 0n, revSpecialTonnageTax: 0n,
      revLocalAllocationTax: 0n, revLocalAllocationOrdinary: 0n,
      revLocalAllocationSpecial: 0n, revTrafficSafetyTax: 0n,
      revSharedBurden: 0n, revUsageFees: 0n, revServiceFees: 0n,
      revNationalSubsidy: 0n, revPrefectureSubsidy: 0n, revPropertyIncome: 0n,
      revDonations: 0n, revTransfersIn: 0n, revCarryover: 0n,
      revMiscellaneous: 0n, revLocalBond: 0n, revTotal: 100000n,
      expAssembly: 0n, expGeneralAdmin: 0n, expWelfare: 0n, expHealth: 0n,
      expLabor: 0n, expAgriculture: 0n, expCommerce: 0n,
      expCivilEngineering: 0n, expFirefighting: 0n, expEducation: 0n,
      expDisasterRecovery: 0n, expDebtService: 0n, expPurposeOther: 0n,
      expPurposeTotal: 90000n,
      expPersonnel: 0n, expPersonnelSalary: 0n, expAssistance: 0n,
      expDebtServiceNature: 0n, expMandatoryTotal: 0n, expMaterials: 0n,
      expMaintenance: 0n, expSubsidies: 0n, expReserves: 0n,
      expInvestmentLoans: 0n, expTransfersOut: 0n,
      expConstructionSubsidy: 0n, expConstructionIndependent: 0n,
      expConstructionTotal: 0n, expDisasterRecoveryNature: 0n,
      expNatureOther: 0n, expNatureTotal: 90000n,
      fiscalPowerIndex: 0, currentBalanceRatio: 0, realBalanceRatio: 0,
      realDebtServiceRatio: 0, debtBurdenRatio: 0,
      standardFiscalScale: 0n, basicFiscalRevenue: 0n, basicFiscalDemand: 0n,
      reserveFundTotal: 0n, reserveFundFiscal: 0n, reserveFundDebt: 0n,
      reserveFundOther: 0n, localBondBalance: 0n,
      population: 0, similarGroupCode: "",
    },
    errors: [],
    warnings: [],
    ...overrides,
  };
}

describe("computePreviewSummary", () => {
  it("空配列に対して0件のサマリーを返す", () => {
    const summary = computePreviewSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.insertCount).toBe(0);
    expect(summary.updateCount).toBe(0);
    expect(summary.skipCount).toBe(0);
    expect(summary.invalidCount).toBe(0);
  });

  it("各ステータスをカウントする", () => {
    const previews = [
      createMockPreview({ status: "insert" }),
      createMockPreview({ status: "insert" }),
      createMockPreview({ status: "update" }),
      createMockPreview({ status: "skip" }),
      createMockPreview({ status: "invalid" }),
    ];

    const summary = computePreviewSummary(previews);
    expect(summary.total).toBe(5);
    expect(summary.insertCount).toBe(2);
    expect(summary.updateCount).toBe(1);
    expect(summary.skipCount).toBe(1);
    expect(summary.invalidCount).toBe(1);
  });

  it("エラーと警告を集約する", () => {
    const previews = [
      createMockPreview({
        errors: [
          { path: "test", code: "IMPORT_REQUIRED_FIELD_MISSING", message: "err1", severity: "error" },
        ],
        warnings: [
          { path: "test", code: "IMPORT_TOTAL_MISMATCH", message: "warn1", severity: "warning" },
        ],
      }),
      createMockPreview({
        warnings: [
          { path: "test2", code: "IMPORT_ALREADY_EXISTS", message: "warn2", severity: "warning" },
        ],
      }),
    ];

    const summary = computePreviewSummary(previews);
    expect(summary.errors).toHaveLength(1);
    expect(summary.warnings).toHaveLength(2);
  });
});
