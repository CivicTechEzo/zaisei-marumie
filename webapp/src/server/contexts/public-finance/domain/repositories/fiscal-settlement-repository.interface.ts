import type { FiscalYearSettlement } from "@prisma/client";

export interface IFiscalSettlementRepository {
  findByMunicipalityAndYear(
    municipalityId: bigint,
    fiscalYear: number,
  ): Promise<FiscalYearSettlement | null>;
  getAvailableYears(municipalityId: bigint): Promise<number[]>;
}
