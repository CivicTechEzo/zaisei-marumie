import type { FiscalYearSettlement } from "@/server/contexts/public-finance/domain/models/fiscal-year-settlement";

export interface IFiscalSettlementRepository {
  findByMunicipalityAndYear(
    municipalityId: bigint,
    fiscalYear: number,
  ): Promise<FiscalYearSettlement | null>;
  getAvailableYears(municipalityId: bigint): Promise<number[]>;
  getLatestYear(municipalityId: bigint): Promise<number | null>;
  /**
   * 全自治体を通じた利用可能年度の一覧を降順で返す
   */
  getAllDistinctYears(): Promise<number[]>;
}
