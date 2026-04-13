import {
  mapExcelToSettlements,
} from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import type {
  ParsedExcelData,
  RawExcelRow,
} from "@/server/contexts/data-import/domain/services/excel-to-settlement-mapper";
import type { MunicipalityLookup } from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";

function createLookup(): Map<string, MunicipalityLookup> {
  return new Map([
    ["01100", { id: 1n, municipalityCode: "011002", displayName: "札幌市" }],
    ["01202", { id: 2n, municipalityCode: "012025", displayName: "函館市" }],
  ]);
}

function createEmptyParsed(): ParsedExcelData {
  return {
    survey: [],
    revenue: [],
    expensePurpose: [],
    expenseNature: [],
    localBond: [],
  };
}

describe("mapExcelToSettlements", () => {
  it("北海道の団体コードのみ抽出する", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      { 団体コード: "01100", 団体名: "札幌市", 歳入合計: 1000000 },
      { 団体コード: "13100", 団体名: "東京都千代田区", 歳入合計: 500000 },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    // 北海道のみ（東京は除外）
    expect(result).toHaveLength(1);
    expect(result[0].municipalityCode).toBe("01100");
  });

  it("歳入データを正しくマッピングする", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      {
        団体コード: "01100",
        団体名: "札幌市",
        地方税: 300000,
        地方交付税: 200000,
        歳入合計: 500000,
      },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    expect(result[0].data.revLocalTax).toBe(300000n);
    expect(result[0].data.revTotal).toBe(500000n);
  });

  it("Municipality未登録の団体コードでエラーを追加する", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      { 団体コード: "01999", 団体名: "不明市", 歳入合計: 100000 },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    expect(result[0].status).toBe("invalid");
    expect(result[0].errors).toContainEqual(
      expect.objectContaining({ code: "IMPORT_MUNICIPALITY_NOT_FOUND" }),
    );
  });

  it("5桁未満の団体コードを0パディングする", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      { 団体コード: 1100, 団体名: "札幌市", 歳入合計: 100000 },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    expect(result[0].municipalityCode).toBe("01100");
    expect(result[0].municipalityId).toBe(1n);
  });

  it("複数ファイルのデータを統合する", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      { 団体コード: "01100", 団体名: "札幌市", 歳入合計: 1000000 },
    ];
    parsed.expensePurpose = [
      { 団体コード: "01100", 団体名: "札幌市", 議会費: 5000, 歳出合計: 900000 },
    ];
    parsed.survey = [
      { 団体コード: "01100", 団体名: "札幌市", 財政力指数: 0.682, 人口: 1970000 },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    expect(result[0].data.revTotal).toBe(1000000n);
    expect(result[0].data.expAssembly).toBe(5000n);
    expect(result[0].data.expPurposeTotal).toBe(900000n);
    expect(result[0].data.fiscalPowerIndex).toBeCloseTo(0.682);
    expect(result[0].data.population).toBe(1970000);
  });

  it("金額のカンマ区切り文字列を正しく変換する", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      { 団体コード: "01100", 団体名: "札幌市", 歳入合計: "1,000,000" },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    expect(result[0].data.revTotal).toBe(1000000n);
  });

  it("空値や - をゼロとして処理する", () => {
    const parsed = createEmptyParsed();
    parsed.revenue = [
      { 団体コード: "01100", 団体名: "札幌市", 地方税: "-", 歳入合計: "" },
    ];
    const lookup = createLookup();
    const result = mapExcelToSettlements(parsed, 2024, lookup);

    expect(result[0].data.revLocalTax).toBe(0n);
    expect(result[0].data.revTotal).toBe(0n);
  });
});
