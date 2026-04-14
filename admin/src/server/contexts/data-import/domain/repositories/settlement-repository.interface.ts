/**
 * 決算データリポジトリインターフェース
 */

import type { SettlementPreviewData } from "@/server/contexts/data-import/domain/models/settlement-preview";

export interface ExistingSettlement {
  municipalityId: bigint;
  fiscalYear: number;
}

export interface UpsertSettlementInput {
  municipalityId: bigint;
  fiscalYear: number;
  data: SettlementPreviewData;
  dataSource: string;
}

export interface MunicipalityLookup {
  id: bigint;
  municipalityCode: string;
  displayName: string;
}

export interface ISettlementRepository {
  findExistingByFiscalYear(fiscalYear: number): Promise<ExistingSettlement[]>;

  findImportedFiscalYears(): Promise<number[]>;

  upsertMany(inputs: UpsertSettlementInput[]): Promise<number>;

  findAllHokkaidoMunicipalities(): Promise<MunicipalityLookup[]>;
}
