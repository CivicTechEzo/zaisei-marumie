/**
 * SettlementValidator
 *
 * マッピング後の決算データの妥当性を検証する。
 * - 必須項目チェック（団体コード、年度、歳入合計、歳出合計）
 * - 数値整合性チェック（合計値 vs 内訳の合算、許容誤差 ±1）
 * - 重複チェック（既存データとの比較 → insert/update/skip 判定）
 * - Municipality未登録チェック
 */

import type { SettlementPreview } from "@/server/contexts/data-import/domain/models/settlement-preview";
import type { ValidationError } from "@/server/contexts/data-import/domain/types/validation";
import type { ExistingSettlement } from "@/server/contexts/data-import/domain/repositories/settlement-repository.interface";

/** 合計値チェックの許容誤差（千円単位で ±1） */
const TOLERANCE = 1n;

function absBigInt(v: bigint): bigint {
  return v < 0n ? -v : v;
}

export function validateSettlementPreviews(
  previews: SettlementPreview[],
  existingSettlements: ExistingSettlement[],
): SettlementPreview[] {
  const existingSet = new Set(
    existingSettlements.map(
      (e) => `${e.municipalityId.toString()}_${e.fiscalYear}`,
    ),
  );

  return previews.map((preview) => {
    const errors: ValidationError[] = [...preview.errors];
    const warnings: ValidationError[] = [...preview.warnings];

    // ---- 必須項目チェック ----
    if (!preview.municipalityCode) {
      errors.push({
        path: `${preview.municipalityName}.municipalityCode`,
        code: "IMPORT_REQUIRED_FIELD_MISSING",
        message: "団体コードが欠損しています",
        severity: "error",
      });
    }

    if (preview.data.revTotal === 0n) {
      errors.push({
        path: `${preview.municipalityName}.revTotal`,
        code: "IMPORT_REQUIRED_FIELD_MISSING",
        message: "歳入合計が0または欠損しています",
        severity: "error",
      });
    }

    if (preview.data.expPurposeTotal === 0n) {
      errors.push({
        path: `${preview.municipalityName}.expPurposeTotal`,
        code: "IMPORT_REQUIRED_FIELD_MISSING",
        message: "歳出合計（目的別）が0または欠損しています",
        severity: "error",
      });
    }

    // ---- 歳入合計の整合性チェック ----
    const revSum =
      preview.data.revLocalTax +
      preview.data.revLocalTransferTax +
      preview.data.revStockTransferTax +
      preview.data.revDividendTransferTax +
      preview.data.revCapitalGainsTransferTax +
      preview.data.revLocalConsumptionTax +
      preview.data.revGolfCourseTax +
      preview.data.revEnvironmentTax +
      preview.data.revNationalPropertyTax +
      preview.data.revSpecialTonnageTax +
      preview.data.revLocalAllocationTax +
      preview.data.revTrafficSafetyTax +
      preview.data.revSharedBurden +
      preview.data.revUsageFees +
      preview.data.revServiceFees +
      preview.data.revNationalSubsidy +
      preview.data.revPrefectureSubsidy +
      preview.data.revPropertyIncome +
      preview.data.revDonations +
      preview.data.revTransfersIn +
      preview.data.revCarryover +
      preview.data.revMiscellaneous +
      preview.data.revLocalBond;

    if (
      preview.data.revTotal > 0n &&
      revSum > 0n &&
      absBigInt(preview.data.revTotal - revSum) > TOLERANCE
    ) {
      warnings.push({
        path: `${preview.municipalityName}.revTotal`,
        code: "IMPORT_TOTAL_MISMATCH",
        message: `歳入合計(${preview.data.revTotal})と内訳合算(${revSum})が一致しません（差分: ${preview.data.revTotal - revSum}）`,
        severity: "warning",
      });
    }

    // ---- 目的別歳出合計の整合性チェック ----
    const expPurposeSum =
      preview.data.expAssembly +
      preview.data.expGeneralAdmin +
      preview.data.expWelfare +
      preview.data.expHealth +
      preview.data.expLabor +
      preview.data.expAgriculture +
      preview.data.expCommerce +
      preview.data.expCivilEngineering +
      preview.data.expFirefighting +
      preview.data.expEducation +
      preview.data.expDisasterRecovery +
      preview.data.expDebtService +
      preview.data.expPurposeOther;

    if (
      preview.data.expPurposeTotal > 0n &&
      expPurposeSum > 0n &&
      absBigInt(preview.data.expPurposeTotal - expPurposeSum) > TOLERANCE
    ) {
      warnings.push({
        path: `${preview.municipalityName}.expPurposeTotal`,
        code: "IMPORT_TOTAL_MISMATCH",
        message: `歳出合計・目的別(${preview.data.expPurposeTotal})と内訳合算(${expPurposeSum})が一致しません`,
        severity: "warning",
      });
    }

    // ---- 重複チェック（insert / update / skip 判定） ----
    let status = preview.status;
    if (status !== "invalid" && preview.municipalityId !== null) {
      const key = `${preview.municipalityId.toString()}_${preview.fiscalYear}`;
      if (existingSet.has(key)) {
        status = "update";
        warnings.push({
          path: `${preview.municipalityName}`,
          code: "IMPORT_ALREADY_EXISTS",
          message: `${preview.municipalityName}の${preview.fiscalYear}年度データは既に登録済みです（上書き更新されます）`,
          severity: "warning",
        });
      } else {
        status = "insert";
      }
    }

    if (errors.length > preview.errors.length) {
      status = "invalid";
    }

    return {
      ...preview,
      status,
      errors,
      warnings,
    };
  });
}
