import { validateSettlementPreviews } from "@/server/contexts/data-import/domain/services/settlement-validator";
import type { SettlementPreview, SettlementPreviewData } from "@/server/contexts/data-import/domain/models/settlement-preview";
import type { ExistingSettlement } from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";

function createEmptyData(): SettlementPreviewData {
  return {
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
  };
}

function createPreview(overrides: Partial<SettlementPreview> = {}): SettlementPreview {
  return {
    municipalityCode: "01100",
    municipalityName: "札幌市",
    municipalityId: 1n,
    fiscalYear: 2024,
    status: "insert",
    data: createEmptyData(),
    errors: [],
    warnings: [],
    ...overrides,
  };
}

describe("validateSettlementPreviews", () => {
  describe("必須項目チェック", () => {
    it("団体コードが欠損している場合にエラーを追加する", () => {
      const previews = [createPreview({ municipalityCode: "" })];
      const result = validateSettlementPreviews(previews, []);

      expect(result[0].status).toBe("invalid");
      expect(result[0].errors).toContainEqual(
        expect.objectContaining({ code: "IMPORT_REQUIRED_FIELD_MISSING" }),
      );
    });

    it("歳入合計が0の場合にエラーを追加する", () => {
      const data = createEmptyData();
      data.revTotal = 0n;
      const previews = [createPreview({ data })];
      const result = validateSettlementPreviews(previews, []);

      expect(result[0].errors).toContainEqual(
        expect.objectContaining({
          code: "IMPORT_REQUIRED_FIELD_MISSING",
          path: expect.stringContaining("revTotal"),
        }),
      );
    });

    it("歳出合計が0の場合にエラーを追加する", () => {
      const data = createEmptyData();
      data.expPurposeTotal = 0n;
      const previews = [createPreview({ data })];
      const result = validateSettlementPreviews(previews, []);

      expect(result[0].errors).toContainEqual(
        expect.objectContaining({
          code: "IMPORT_REQUIRED_FIELD_MISSING",
          path: expect.stringContaining("expPurposeTotal"),
        }),
      );
    });
  });

  describe("数値整合性チェック", () => {
    it("歳入合計と内訳が一致する場合はwarningを出さない", () => {
      const data = createEmptyData();
      data.revLocalTax = 50000n;
      data.revLocalBond = 50000n;
      data.revTotal = 100000n;
      const previews = [createPreview({ data })];
      const result = validateSettlementPreviews(previews, []);

      expect(
        result[0].warnings.filter((w) => w.code === "IMPORT_TOTAL_MISMATCH"),
      ).toHaveLength(0);
    });

    it("歳入合計と内訳が大きく不一致の場合にwarningを出す", () => {
      const data = createEmptyData();
      data.revLocalTax = 30000n;
      data.revLocalBond = 30000n;
      data.revTotal = 100000n; // 合計は100000だが内訳は60000
      const previews = [createPreview({ data })];
      const result = validateSettlementPreviews(previews, []);

      expect(result[0].warnings).toContainEqual(
        expect.objectContaining({ code: "IMPORT_TOTAL_MISMATCH" }),
      );
    });
  });

  describe("重複チェック", () => {
    it("既存データがない場合はinsertステータスになる", () => {
      const previews = [createPreview()];
      const result = validateSettlementPreviews(previews, []);

      expect(result[0].status).toBe("insert");
    });

    it("同一municipalityId+fiscalYearの既存データがある場合はupdateステータスになる", () => {
      const previews = [createPreview({ municipalityId: 1n, fiscalYear: 2024 })];
      const existing: ExistingSettlement[] = [
        { municipalityId: 1n, fiscalYear: 2024 },
      ];
      const result = validateSettlementPreviews(previews, existing);

      expect(result[0].status).toBe("update");
      expect(result[0].warnings).toContainEqual(
        expect.objectContaining({ code: "IMPORT_ALREADY_EXISTS" }),
      );
    });

    it("invalidステータスは重複チェックで変更されない", () => {
      const previews = [
        createPreview({
          status: "invalid",
          errors: [
            { path: "test", code: "IMPORT_MUNICIPALITY_NOT_FOUND", message: "test", severity: "error" },
          ],
        }),
      ];
      const existing: ExistingSettlement[] = [
        { municipalityId: 1n, fiscalYear: 2024 },
      ];
      const result = validateSettlementPreviews(previews, existing);

      expect(result[0].status).toBe("invalid");
    });
  });
});
