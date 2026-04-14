/**
 * public-finance コンテキストのエラーコード定義
 */

export class MunicipalityNotFoundError extends Error {
  readonly code = "MUNICIPALITY_NOT_FOUND" as const;

  constructor(slug: string) {
    super(`指定された自治体が見つかりません: ${slug}`);
    this.name = "MunicipalityNotFoundError";
  }
}

export class SettlementNotFoundError extends Error {
  readonly code = "SETTLEMENT_NOT_FOUND" as const;

  constructor(municipalityId: bigint, fiscalYear: number) {
    super(
      `指定された年度の決算データがありません: municipalityId=${municipalityId}, fiscalYear=${fiscalYear}`,
    );
    this.name = "SettlementNotFoundError";
  }
}

export class SettlementAggregationMismatchWarning {
  readonly code = "SETTLEMENT_AGGREGATION_MISMATCH" as const;
  readonly message: string;

  constructor(type: "revenue" | "expense", expected: number, actual: number) {
    const label = type === "revenue" ? "歳入" : "歳出";
    this.message = `${label}の内訳合計(${actual})と合計値(${expected})が一致しません`;
  }

  log(): void {
    console.warn(`[${this.code}] ${this.message}`);
  }
}
