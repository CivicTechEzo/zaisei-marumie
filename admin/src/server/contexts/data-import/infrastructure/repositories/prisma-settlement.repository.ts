/**
 * PrismaSettlementRepository
 *
 * FiscalYearSettlement テーブルへのデータアクセス層。
 * municipalityId + fiscalYear の複合ユニーク制約を使った upsert を提供する。
 */

import type { PrismaClient } from "@prisma/client";
import type {
  ISettlementRepository,
  ExistingSettlement,
  UpsertSettlementInput,
  MunicipalityLookup,
} from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";

export class PrismaSettlementRepository implements ISettlementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findExistingByFiscalYear(fiscalYear: number): Promise<ExistingSettlement[]> {
    const records = await this.prisma.fiscalYearSettlement.findMany({
      where: { fiscalYear },
      select: { municipalityId: true, fiscalYear: true },
    });

    return records.map((r) => ({
      municipalityId: r.municipalityId,
      fiscalYear: r.fiscalYear,
    }));
  }

  async findImportedFiscalYears(): Promise<number[]> {
    const result = await this.prisma.fiscalYearSettlement.findMany({
      select: { fiscalYear: true },
      distinct: ["fiscalYear"],
      orderBy: { fiscalYear: "desc" },
    });

    return result.map((r) => r.fiscalYear);
  }

  async upsertMany(inputs: UpsertSettlementInput[]): Promise<number> {
    let count = 0;

    // バッチ処理（トランザクション内で一括実行）
    await this.prisma.$transaction(async (tx) => {
      for (const input of inputs) {
        await tx.fiscalYearSettlement.upsert({
          where: {
            municipalityId_fiscalYear: {
              municipalityId: input.municipalityId,
              fiscalYear: input.fiscalYear,
            },
          },
          create: {
            municipalityId: input.municipalityId,
            fiscalYear: input.fiscalYear,
            dataSource: input.dataSource,
            ...bigintDataToCreate(input.data),
          },
          update: {
            dataSource: input.dataSource,
            ...bigintDataToCreate(input.data),
          },
        });
        count++;
      }
    });

    return count;
  }

  async findAllHokkaidoMunicipalities(): Promise<MunicipalityLookup[]> {
    const municipalities = await this.prisma.municipality.findMany({
      where: {
        municipalityCode: { startsWith: "01" },
      },
      select: {
        id: true,
        municipalityCode: true,
        displayName: true,
      },
      orderBy: { municipalityCode: "asc" },
    });

    return municipalities.map((m) => ({
      id: m.id,
      municipalityCode: m.municipalityCode,
      displayName: m.displayName,
    }));
  }
}

/**
 * SettlementPreviewData → Prisma create/update 用データに変換
 */
function bigintDataToCreate(data: UpsertSettlementInput["data"]): Record<string, unknown> {
  return {
    // 歳入
    revLocalTax: data.revLocalTax,
    revLocalTransferTax: data.revLocalTransferTax,
    revStockTransferTax: data.revStockTransferTax,
    revDividendTransferTax: data.revDividendTransferTax,
    revCapitalGainsTransferTax: data.revCapitalGainsTransferTax,
    revLocalConsumptionTax: data.revLocalConsumptionTax,
    revGolfCourseTax: data.revGolfCourseTax,
    revEnvironmentTax: data.revEnvironmentTax,
    revNationalPropertyTax: data.revNationalPropertyTax,
    revSpecialTonnageTax: data.revSpecialTonnageTax,
    revLocalAllocationTax: data.revLocalAllocationTax,
    revLocalAllocationOrdinary: data.revLocalAllocationOrdinary,
    revLocalAllocationSpecial: data.revLocalAllocationSpecial,
    revTrafficSafetyTax: data.revTrafficSafetyTax,
    revSharedBurden: data.revSharedBurden,
    revUsageFees: data.revUsageFees,
    revServiceFees: data.revServiceFees,
    revNationalSubsidy: data.revNationalSubsidy,
    revPrefectureSubsidy: data.revPrefectureSubsidy,
    revPropertyIncome: data.revPropertyIncome,
    revDonations: data.revDonations,
    revTransfersIn: data.revTransfersIn,
    revCarryover: data.revCarryover,
    revMiscellaneous: data.revMiscellaneous,
    revLocalBond: data.revLocalBond,
    revTotal: data.revTotal,
    // 歳出・目的別
    expAssembly: data.expAssembly,
    expGeneralAdmin: data.expGeneralAdmin,
    expWelfare: data.expWelfare,
    expHealth: data.expHealth,
    expLabor: data.expLabor,
    expAgriculture: data.expAgriculture,
    expCommerce: data.expCommerce,
    expCivilEngineering: data.expCivilEngineering,
    expFirefighting: data.expFirefighting,
    expEducation: data.expEducation,
    expDisasterRecovery: data.expDisasterRecovery,
    expDebtService: data.expDebtService,
    expPurposeOther: data.expPurposeOther,
    expPurposeTotal: data.expPurposeTotal,
    // 歳出・性質別
    expPersonnel: data.expPersonnel,
    expPersonnelSalary: data.expPersonnelSalary,
    expAssistance: data.expAssistance,
    expDebtServiceNature: data.expDebtServiceNature,
    expMandatoryTotal: data.expMandatoryTotal,
    expMaterials: data.expMaterials,
    expMaintenance: data.expMaintenance,
    expSubsidies: data.expSubsidies,
    expReserves: data.expReserves,
    expInvestmentLoans: data.expInvestmentLoans,
    expTransfersOut: data.expTransfersOut,
    expConstructionSubsidy: data.expConstructionSubsidy,
    expConstructionIndependent: data.expConstructionIndependent,
    expConstructionTotal: data.expConstructionTotal,
    expDisasterRecoveryNature: data.expDisasterRecoveryNature,
    expNatureOther: data.expNatureOther,
    expNatureTotal: data.expNatureTotal,
    // 財政指標
    fiscalPowerIndex: data.fiscalPowerIndex,
    currentBalanceRatio: data.currentBalanceRatio,
    realBalanceRatio: data.realBalanceRatio,
    realDebtServiceRatio: data.realDebtServiceRatio,
    debtBurdenRatio: data.debtBurdenRatio,
    standardFiscalScale: data.standardFiscalScale,
    basicFiscalRevenue: data.basicFiscalRevenue,
    basicFiscalDemand: data.basicFiscalDemand,
    // ストック情報
    reserveFundTotal: data.reserveFundTotal,
    reserveFundFiscal: data.reserveFundFiscal,
    reserveFundDebt: data.reserveFundDebt,
    reserveFundOther: data.reserveFundOther,
    localBondBalance: data.localBondBalance,
    // メタデータ
    population: data.population,
    similarGroupCode: data.similarGroupCode,
  };
}
