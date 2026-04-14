import "server-only";

import type {
  PrismaClient,
  FiscalYearSettlement as PrismaFiscalYearSettlement,
} from "@prisma/client";
import type { IFiscalSettlementRepository } from "@/server/contexts/public-finance/domain/repositories/fiscal-settlement-repository.interface";
import type { FiscalYearSettlement } from "@/server/contexts/public-finance/domain/models/fiscal-year-settlement";

export class PrismaFiscalSettlementRepository implements IFiscalSettlementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByMunicipalityAndYear(
    municipalityId: bigint,
    fiscalYear: number,
  ): Promise<FiscalYearSettlement | null> {
    const record = await this.prisma.fiscalYearSettlement.findUnique({
      where: {
        municipalityId_fiscalYear: {
          municipalityId,
          fiscalYear,
        },
      },
    });

    if (!record) return null;

    return toDomainModel(record);
  }

  async getAvailableYears(municipalityId: bigint): Promise<number[]> {
    const records = await this.prisma.fiscalYearSettlement.findMany({
      where: { municipalityId },
      select: { fiscalYear: true },
      orderBy: { fiscalYear: "desc" },
    });
    return records.map((r) => r.fiscalYear);
  }

  async getLatestYear(municipalityId: bigint): Promise<number | null> {
    const record = await this.prisma.fiscalYearSettlement.findFirst({
      where: { municipalityId },
      select: { fiscalYear: true },
      orderBy: { fiscalYear: "desc" },
    });
    return record?.fiscalYear ?? null;
  }

  async getAllDistinctYears(): Promise<number[]> {
    const records = await this.prisma.fiscalYearSettlement.findMany({
      select: { fiscalYear: true },
      distinct: ["fiscalYear"],
      orderBy: { fiscalYear: "desc" },
    });
    return records.map((r) => r.fiscalYear);
  }
}

/**
 * Prisma の FiscalYearSettlement をドメインモデルに変換
 *
 * - BigInt → Number（千円単位のため JavaScript Number 安全整数範囲内）
 * - Decimal → Number（parseFloat）
 */
function toDomainModel(record: PrismaFiscalYearSettlement): FiscalYearSettlement {
  return {
    id: record.id,
    municipalityId: record.municipalityId,
    fiscalYear: record.fiscalYear,

    // 歳入
    revLocalTax: Number(record.revLocalTax),
    revLocalTransferTax: Number(record.revLocalTransferTax),
    revStockTransferTax: Number(record.revStockTransferTax),
    revDividendTransferTax: Number(record.revDividendTransferTax),
    revCapitalGainsTransferTax: Number(record.revCapitalGainsTransferTax),
    revLocalConsumptionTax: Number(record.revLocalConsumptionTax),
    revGolfCourseTax: Number(record.revGolfCourseTax),
    revEnvironmentTax: Number(record.revEnvironmentTax),
    revNationalPropertyTax: Number(record.revNationalPropertyTax),
    revSpecialTonnageTax: Number(record.revSpecialTonnageTax),
    revLocalAllocationTax: Number(record.revLocalAllocationTax),
    revLocalAllocationOrdinary: Number(record.revLocalAllocationOrdinary),
    revLocalAllocationSpecial: Number(record.revLocalAllocationSpecial),
    revTrafficSafetyTax: Number(record.revTrafficSafetyTax),
    revSharedBurden: Number(record.revSharedBurden),
    revUsageFees: Number(record.revUsageFees),
    revServiceFees: Number(record.revServiceFees),
    revNationalSubsidy: Number(record.revNationalSubsidy),
    revPrefectureSubsidy: Number(record.revPrefectureSubsidy),
    revPropertyIncome: Number(record.revPropertyIncome),
    revDonations: Number(record.revDonations),
    revTransfersIn: Number(record.revTransfersIn),
    revCarryover: Number(record.revCarryover),
    revMiscellaneous: Number(record.revMiscellaneous),
    revLocalBond: Number(record.revLocalBond),
    revTotal: Number(record.revTotal),

    // 歳出・目的別
    expAssembly: Number(record.expAssembly),
    expGeneralAdmin: Number(record.expGeneralAdmin),
    expWelfare: Number(record.expWelfare),
    expHealth: Number(record.expHealth),
    expLabor: Number(record.expLabor),
    expAgriculture: Number(record.expAgriculture),
    expCommerce: Number(record.expCommerce),
    expCivilEngineering: Number(record.expCivilEngineering),
    expFirefighting: Number(record.expFirefighting),
    expEducation: Number(record.expEducation),
    expDisasterRecovery: Number(record.expDisasterRecovery),
    expDebtService: Number(record.expDebtService),
    expPurposeOther: Number(record.expPurposeOther),
    expPurposeTotal: Number(record.expPurposeTotal),

    // 歳出・性質別
    expPersonnel: Number(record.expPersonnel),
    expPersonnelSalary: Number(record.expPersonnelSalary),
    expAssistance: Number(record.expAssistance),
    expDebtServiceNature: Number(record.expDebtServiceNature),
    expMandatoryTotal: Number(record.expMandatoryTotal),
    expMaterials: Number(record.expMaterials),
    expMaintenance: Number(record.expMaintenance),
    expSubsidies: Number(record.expSubsidies),
    expReserves: Number(record.expReserves),
    expInvestmentLoans: Number(record.expInvestmentLoans),
    expTransfersOut: Number(record.expTransfersOut),
    expConstructionSubsidy: Number(record.expConstructionSubsidy),
    expConstructionIndependent: Number(record.expConstructionIndependent),
    expConstructionTotal: Number(record.expConstructionTotal),
    expDisasterRecoveryNature: Number(record.expDisasterRecoveryNature),
    expNatureOther: Number(record.expNatureOther),
    expNatureTotal: Number(record.expNatureTotal),

    // 財政指標
    fiscalPowerIndex: parseFloat(String(record.fiscalPowerIndex)),
    currentBalanceRatio: parseFloat(String(record.currentBalanceRatio)),
    realBalanceRatio: parseFloat(String(record.realBalanceRatio)),
    realDebtServiceRatio: parseFloat(String(record.realDebtServiceRatio)),
    debtBurdenRatio: parseFloat(String(record.debtBurdenRatio)),
    standardFiscalScale: Number(record.standardFiscalScale),
    basicFiscalRevenue: Number(record.basicFiscalRevenue),
    basicFiscalDemand: Number(record.basicFiscalDemand),

    // ストック情報
    reserveFundTotal: Number(record.reserveFundTotal),
    reserveFundFiscal: Number(record.reserveFundFiscal),
    reserveFundDebt: Number(record.reserveFundDebt),
    reserveFundOther: Number(record.reserveFundOther),
    localBondBalance: Number(record.localBondBalance),

    // メタデータ
    population: record.population,
    similarGroupCode: record.similarGroupCode,
    dataSource: record.dataSource,

    // タイムスタンプ
    updatedAt: record.updatedAt,
  };
}
