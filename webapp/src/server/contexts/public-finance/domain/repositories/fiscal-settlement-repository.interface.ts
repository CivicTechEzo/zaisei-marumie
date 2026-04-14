import type { FiscalYearSettlement } from "@/server/contexts/public-finance/domain/models/fiscal-year-settlement";

export interface IFiscalSettlementRepository {
  findByMunicipalityAndYear(
    municipalityId: bigint,
    fiscalYear: number,
  ): Promise<FiscalYearSettlement | null>;
  getAvailableYears(municipalityId: bigint): Promise<number[]>;
  getLatestYear(municipalityId: bigint): Promise<number | null>;
}
