import {
  isValidFiscalYearCode,
  fiscalYearCodeToYear,
  fiscalYearToCode,
  FISCAL_YEAR_OPTIONS,
} from "@/server/contexts/data-import/domain/models/fiscal-year-code";

describe("FiscalYearCode", () => {
  describe("isValidFiscalYearCode", () => {
    it("有効な年度コードを受け入れる", () => {
      expect(isValidFiscalYearCode("h27")).toBe(true);
      expect(isValidFiscalYearCode("h30")).toBe(true);
      expect(isValidFiscalYearCode("r01")).toBe(true);
      expect(isValidFiscalYearCode("r06")).toBe(true);
    });

    it("無効な年度コードを拒否する", () => {
      expect(isValidFiscalYearCode("h26")).toBe(false);
      expect(isValidFiscalYearCode("r07")).toBe(false);
      expect(isValidFiscalYearCode("invalid")).toBe(false);
      expect(isValidFiscalYearCode("")).toBe(false);
    });
  });

  describe("fiscalYearCodeToYear", () => {
    it("平成のコードを西暦に変換する", () => {
      expect(fiscalYearCodeToYear("h27")).toBe(2015);
      expect(fiscalYearCodeToYear("h28")).toBe(2016);
      expect(fiscalYearCodeToYear("h29")).toBe(2017);
      expect(fiscalYearCodeToYear("h30")).toBe(2018);
    });

    it("令和のコードを西暦に変換する", () => {
      expect(fiscalYearCodeToYear("r01")).toBe(2019);
      expect(fiscalYearCodeToYear("r02")).toBe(2020);
      expect(fiscalYearCodeToYear("r05")).toBe(2023);
      expect(fiscalYearCodeToYear("r06")).toBe(2024);
    });
  });

  describe("fiscalYearToCode", () => {
    it("西暦を平成のコードに変換する", () => {
      expect(fiscalYearToCode(2015)).toBe("h27");
      expect(fiscalYearToCode(2018)).toBe("h30");
    });

    it("西暦を令和のコードに変換する", () => {
      expect(fiscalYearToCode(2019)).toBe("r01");
      expect(fiscalYearToCode(2024)).toBe("r06");
    });

    it("サポート外の年度でエラーを投げる", () => {
      expect(() => fiscalYearToCode(2014)).toThrow("サポート外の年度");
      expect(() => fiscalYearToCode(2030)).toThrow("サポート外の年度");
    });
  });

  describe("FISCAL_YEAR_OPTIONS", () => {
    it("10個の選択肢がある", () => {
      expect(FISCAL_YEAR_OPTIONS).toHaveLength(10);
    });

    it("新しい年度から順に並んでいる", () => {
      expect(FISCAL_YEAR_OPTIONS[0].code).toBe("r06");
      expect(FISCAL_YEAR_OPTIONS[FISCAL_YEAR_OPTIONS.length - 1].code).toBe("h27");
    });

    it("各オプションのfiscalYearとコードが整合する", () => {
      for (const opt of FISCAL_YEAR_OPTIONS) {
        expect(fiscalYearCodeToYear(opt.code)).toBe(opt.fiscalYear);
      }
    });
  });
});
