import type { PrismaClient } from '@prisma/client';
import type { Seeder } from './lib/types';

/**
 * FiscalYearSettlement のシードデータ
 *
 * 開発・動作確認用に、代表的な自治体のサンプルデータを投入する。
 * データ値は実際の決算カードの概算値に基づく（千円単位）。
 */

type SettlementSeed = {
  municipalityCode: string;
  fiscalYear: number;
  data: Record<string, bigint | number | string>;
};

const seeds: SettlementSeed[] = [
  // 札幌市 2022年度 — 政令指定都市（大規模自治体）
  {
    municipalityCode: '011002',
    fiscalYear: 2022,
    data: {
      // 歳入
      revLocalTax: 312400000n,
      revLocalTransferTax: 1200000n,
      revStockTransferTax: 280000n,
      revDividendTransferTax: 1900000n,
      revCapitalGainsTransferTax: 1100000n,
      revLocalConsumptionTax: 42800000n,
      revGolfCourseTax: 0n,
      revEnvironmentTax: 1200000n,
      revNationalPropertyTax: 0n,
      revSpecialTonnageTax: 2100000n,
      revLocalAllocationTax: 137500000n,
      revLocalAllocationOrdinary: 124500000n,
      revLocalAllocationSpecial: 13000000n,
      revTrafficSafetyTax: 450000n,
      revSharedBurden: 2300000n,
      revUsageFees: 8900000n,
      revServiceFees: 3200000n,
      revNationalSubsidy: 298000000n,
      revPrefectureSubsidy: 48500000n,
      revPropertyIncome: 4200000n,
      revDonations: 1500000n,
      revTransfersIn: 28000000n,
      revCarryover: 45000000n,
      revMiscellaneous: 18500000n,
      revLocalBond: 91200000n,
      revTotal: 1050230000n,

      // 歳出・目的別
      expAssembly: 2100000n,
      expGeneralAdmin: 135000000n,
      expWelfare: 421000000n,
      expHealth: 60500000n,
      expLabor: 1200000n,
      expAgriculture: 5800000n,
      expCommerce: 21000000n,
      expCivilEngineering: 57000000n,
      expFirefighting: 20000000n,
      expEducation: 75000000n,
      expDisasterRecovery: 500000n,
      expDebtService: 108000000n,
      expPurposeOther: 95000000n,
      expPurposeTotal: 1002100000n,

      // 歳出・性質別
      expPersonnel: 178000000n,
      expPersonnelSalary: 95000000n,
      expAssistance: 250000000n,
      expDebtServiceNature: 108000000n,
      expMandatoryTotal: 536000000n,
      expMaterials: 75000000n,
      expMaintenance: 9500000n,
      expSubsidies: 135000000n,
      expReserves: 25000000n,
      expInvestmentLoans: 12000000n,
      expTransfersOut: 68000000n,
      expConstructionSubsidy: 42000000n,
      expConstructionIndependent: 55000000n,
      expConstructionTotal: 97000000n,
      expDisasterRecoveryNature: 500000n,
      expNatureOther: 44100000n,
      expNatureTotal: 1002100000n,

      // 財政指標
      fiscalPowerIndex: 0.721,
      currentBalanceRatio: 95.3,
      realBalanceRatio: 2.8,
      realDebtServiceRatio: 12.5,
      debtBurdenRatio: 15.8,
      standardFiscalScale: 450000000n,
      basicFiscalRevenue: 320000000n,
      basicFiscalDemand: 445000000n,

      // ストック情報
      reserveFundTotal: 85000000n,
      reserveFundFiscal: 45000000n,
      reserveFundDebt: 12000000n,
      reserveFundOther: 28000000n,
      localBondBalance: 1200000000n,

      // メタデータ
      population: 1973395,
      similarGroupCode: 'A1',
      dataSource: 'seed',
    },
  },

  // 夕張市 2022年度 — 財政再建団体（特殊なケース）
  {
    municipalityCode: '012092',
    fiscalYear: 2022,
    data: {
      // 歳入
      revLocalTax: 1150000n,
      revLocalTransferTax: 85000n,
      revStockTransferTax: 0n,
      revDividendTransferTax: 2000n,
      revCapitalGainsTransferTax: 1000n,
      revLocalConsumptionTax: 200000n,
      revGolfCourseTax: 0n,
      revEnvironmentTax: 5000n,
      revNationalPropertyTax: 0n,
      revSpecialTonnageTax: 12000n,
      revLocalAllocationTax: 4200000n,
      revLocalAllocationOrdinary: 3900000n,
      revLocalAllocationSpecial: 300000n,
      revTrafficSafetyTax: 3000n,
      revSharedBurden: 5000n,
      revUsageFees: 28000n,
      revServiceFees: 8000n,
      revNationalSubsidy: 2100000n,
      revPrefectureSubsidy: 1500000n,
      revPropertyIncome: 15000n,
      revDonations: 350000n,
      revTransfersIn: 1200000n,
      revCarryover: 520000n,
      revMiscellaneous: 250000n,
      revLocalBond: 580000n,
      revTotal: 12214000n,

      // 歳出・目的別
      expAssembly: 52000n,
      expGeneralAdmin: 2800000n,
      expWelfare: 3100000n,
      expHealth: 580000n,
      expLabor: 8000n,
      expAgriculture: 350000n,
      expCommerce: 120000n,
      expCivilEngineering: 680000n,
      expFirefighting: 85000n,
      expEducation: 420000n,
      expDisasterRecovery: 15000n,
      expDebtService: 3200000n,
      expPurposeOther: 390000n,
      expPurposeTotal: 11800000n,

      // 歳出・性質別
      expPersonnel: 1350000n,
      expPersonnelSalary: 680000n,
      expAssistance: 1800000n,
      expDebtServiceNature: 3200000n,
      expMandatoryTotal: 6350000n,
      expMaterials: 850000n,
      expMaintenance: 120000n,
      expSubsidies: 1500000n,
      expReserves: 250000n,
      expInvestmentLoans: 50000n,
      expTransfersOut: 980000n,
      expConstructionSubsidy: 350000n,
      expConstructionIndependent: 280000n,
      expConstructionTotal: 630000n,
      expDisasterRecoveryNature: 15000n,
      expNatureOther: 255000n,
      expNatureTotal: 11800000n,

      // 財政指標
      fiscalPowerIndex: 0.118,
      currentBalanceRatio: 97.8,
      realBalanceRatio: 3.5,
      realDebtServiceRatio: 42.1,
      debtBurdenRatio: 48.5,
      standardFiscalScale: 4500000n,
      basicFiscalRevenue: 530000n,
      basicFiscalDemand: 4500000n,

      // ストック情報
      reserveFundTotal: 180000n,
      reserveFundFiscal: 120000n,
      reserveFundDebt: 30000n,
      reserveFundOther: 30000n,
      localBondBalance: 32000000n,

      // メタデータ
      population: 6760,
      similarGroupCode: 'III-0',
      dataSource: 'seed',
    },
  },

  // 東川町 2022年度 — 小規模自治体
  {
    municipalityCode: '014583',
    fiscalYear: 2022,
    data: {
      // 歳入
      revLocalTax: 1280000n,
      revLocalTransferTax: 95000n,
      revStockTransferTax: 2000n,
      revDividendTransferTax: 5000n,
      revCapitalGainsTransferTax: 3000n,
      revLocalConsumptionTax: 250000n,
      revGolfCourseTax: 0n,
      revEnvironmentTax: 8000n,
      revNationalPropertyTax: 0n,
      revSpecialTonnageTax: 15000n,
      revLocalAllocationTax: 2800000n,
      revLocalAllocationOrdinary: 2600000n,
      revLocalAllocationSpecial: 200000n,
      revTrafficSafetyTax: 5000n,
      revSharedBurden: 12000n,
      revUsageFees: 85000n,
      revServiceFees: 15000n,
      revNationalSubsidy: 1800000n,
      revPrefectureSubsidy: 850000n,
      revPropertyIncome: 35000n,
      revDonations: 1200000n,
      revTransfersIn: 450000n,
      revCarryover: 680000n,
      revMiscellaneous: 180000n,
      revLocalBond: 1100000n,
      revTotal: 10870000n,

      // 歳出・目的別
      expAssembly: 65000n,
      expGeneralAdmin: 2200000n,
      expWelfare: 2400000n,
      expHealth: 520000n,
      expLabor: 12000n,
      expAgriculture: 680000n,
      expCommerce: 350000n,
      expCivilEngineering: 850000n,
      expFirefighting: 180000n,
      expEducation: 1200000n,
      expDisasterRecovery: 5000n,
      expDebtService: 850000n,
      expPurposeOther: 188000n,
      expPurposeTotal: 9500000n,

      // 歳出・性質別
      expPersonnel: 1350000n,
      expPersonnelSalary: 720000n,
      expAssistance: 1200000n,
      expDebtServiceNature: 850000n,
      expMandatoryTotal: 3400000n,
      expMaterials: 1100000n,
      expMaintenance: 180000n,
      expSubsidies: 1500000n,
      expReserves: 450000n,
      expInvestmentLoans: 80000n,
      expTransfersOut: 620000n,
      expConstructionSubsidy: 650000n,
      expConstructionIndependent: 980000n,
      expConstructionTotal: 1630000n,
      expDisasterRecoveryNature: 5000n,
      expNatureOther: 535000n,
      expNatureTotal: 9500000n,

      // 財政指標
      fiscalPowerIndex: 0.352,
      currentBalanceRatio: 82.5,
      realBalanceRatio: 8.2,
      realDebtServiceRatio: 7.8,
      debtBurdenRatio: 9.2,
      standardFiscalScale: 3200000n,
      basicFiscalRevenue: 1100000n,
      basicFiscalDemand: 3100000n,

      // ストック情報
      reserveFundTotal: 2500000n,
      reserveFundFiscal: 1200000n,
      reserveFundDebt: 350000n,
      reserveFundOther: 950000n,
      localBondBalance: 5800000n,

      // メタデータ
      population: 8396,
      similarGroupCode: 'V-1',
      dataSource: 'seed',
    },
  },
];

export const fiscalYearSettlementsSeeder: Seeder = {
  name: 'FiscalYearSettlements',
  async seed(prisma: PrismaClient) {
    let created = 0;
    let skipped = 0;

    for (const seed of seeds) {
      const municipality = await prisma.municipality.findUnique({
        where: { municipalityCode: seed.municipalityCode },
      });

      if (!municipality) {
        console.log(`  ⚠️  Municipality not found: ${seed.municipalityCode}, skipping`);
        continue;
      }

      const existing = await prisma.fiscalYearSettlement.findUnique({
        where: {
          municipalityId_fiscalYear: {
            municipalityId: municipality.id,
            fiscalYear: seed.fiscalYear,
          },
        },
      });

      if (!existing) {
        await prisma.fiscalYearSettlement.create({
          data: {
            municipalityId: municipality.id,
            fiscalYear: seed.fiscalYear,
            ...seed.data,
          },
        });
        created++;
      } else {
        skipped++;
      }
    }

    console.log(`  ✅ Created: ${created}, ⏭️  Already exists: ${skipped}`);
  },
};
