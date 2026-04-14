import "server-only";

import type { PrismaClient, FiscalYearSettlement } from "@prisma/client";
import type { IFiscalSettlementRepository } from "@/server/contexts/public-finance/domain/repositories/fiscal-settlement-repository.interface";

export class PrismaFiscalSettlementRepository implements IFiscalSettlementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByMunicipalityAndYear(
    municipalityId: bigint,
    fiscalYear: number,
  ): Promise<FiscalYearSettlement | null> {
    return this.prisma.fiscalYearSettlement.findUnique({
      where: {
        municipalityId_fiscalYear: {
          municipalityId,
          fiscalYear,
        },
      },
    });
  }

  async getAvailableYears(municipalityId: bigint): Promise<number[]> {
    const records = await this.prisma.fiscalYearSettlement.findMany({
      where: { municipalityId },
      select: { fiscalYear: true },
      orderBy: { fiscalYear: "desc" },
    });
    return records.map((r) => r.fiscalYear);
  }
}
