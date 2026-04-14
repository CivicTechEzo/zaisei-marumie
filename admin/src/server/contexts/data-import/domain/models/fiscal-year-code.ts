/**
 * 年度コード ↔ 西暦の相互変換
 *
 * 総務省の年度ページURLで使用されるコード（例: "r06"）と西暦年度（例: 2024）を相互変換する。
 */

const ERA_OFFSETS: Record<string, number> = {
  h: 1988, // 平成: h01 = 1989
  r: 2018, // 令和: r01 = 2019
};

const SUPPORTED_CODES = [
  "h27",
  "h28",
  "h29",
  "h30",
  "r01",
  "r02",
  "r03",
  "r04",
  "r05",
  "r06",
] as const;

export type FiscalYearCodeString = (typeof SUPPORTED_CODES)[number];

export const FISCAL_YEAR_OPTIONS: {
  code: FiscalYearCodeString;
  label: string;
  fiscalYear: number;
}[] = [
  { code: "r06", label: "令和6年度 (2024)", fiscalYear: 2024 },
  { code: "r05", label: "令和5年度 (2023)", fiscalYear: 2023 },
  { code: "r04", label: "令和4年度 (2022)", fiscalYear: 2022 },
  { code: "r03", label: "令和3年度 (2021)", fiscalYear: 2021 },
  { code: "r02", label: "令和2年度 (2020)", fiscalYear: 2020 },
  { code: "r01", label: "令和元年度 (2019)", fiscalYear: 2019 },
  { code: "h30", label: "平成30年度 (2018)", fiscalYear: 2018 },
  { code: "h29", label: "平成29年度 (2017)", fiscalYear: 2017 },
  { code: "h28", label: "平成28年度 (2016)", fiscalYear: 2016 },
  { code: "h27", label: "平成27年度 (2015)", fiscalYear: 2015 },
];

export function isValidFiscalYearCode(code: string): code is FiscalYearCodeString {
  return (SUPPORTED_CODES as readonly string[]).includes(code);
}

export function fiscalYearCodeToYear(code: FiscalYearCodeString): number {
  const era = code[0];
  const num = Number.parseInt(code.slice(1), 10);
  const offset = ERA_OFFSETS[era];
  if (offset === undefined) {
    throw new Error(`不正な元号: ${era}`);
  }
  return offset + num;
}

export function fiscalYearToCode(year: number): FiscalYearCodeString {
  if (year >= 2019) {
    const num = year - 2018;
    const code = `r${String(num).padStart(2, "0")}`;
    if (isValidFiscalYearCode(code)) return code;
  } else if (year >= 2015 && year <= 2018) {
    const num = year - 1988;
    const code = `h${String(num).padStart(2, "0")}`;
    if (isValidFiscalYearCode(code)) return code;
  }
  throw new Error(`サポート外の年度: ${year}`);
}
