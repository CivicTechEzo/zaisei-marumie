/**
 * 財政データインポートの入力バリデーションスキーマ
 */

import { z } from "zod";
import { isValidFiscalYearCode } from "@/server/contexts/data-import/domain/models/fiscal-year-code";

export const fetchSettlementPreviewSchema = z.object({
  yearCode: z.string().refine(isValidFiscalYearCode, {
    message:
      "無効な年度コードです。h27〜h30, r01〜r06 のいずれかを指定してください。",
  }),
});

export type FetchSettlementPreviewInput = z.infer<
  typeof fetchSettlementPreviewSchema
>;
