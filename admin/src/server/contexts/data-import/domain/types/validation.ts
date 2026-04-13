/**
 * 財政データインポートのバリデーション関連型定義
 */

export type ValidationSeverity = "error" | "warning";

export interface ValidationError {
  path: string;
  code: ValidationErrorCode;
  message: string;
  severity: ValidationSeverity;
}

export type ValidationErrorCode =
  | "IMPORT_FETCH_FAILED"
  | "IMPORT_PARSE_FAILED"
  | "IMPORT_INVALID_YEAR_CODE"
  | "IMPORT_MUNICIPALITY_NOT_FOUND"
  | "IMPORT_REQUIRED_FIELD_MISSING"
  | "IMPORT_TOTAL_MISMATCH"
  | "IMPORT_ALREADY_EXISTS"
  | "IMPORT_COLUMN_NOT_MAPPED";
