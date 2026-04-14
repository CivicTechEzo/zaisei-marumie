/**
 * 自治体ドメインモデル
 */
export interface Municipality {
  id: bigint;
  slug: string;
  displayName: string;
  municipalityCode: string;
  municipalityType: "prefecture" | "city" | "town" | "village";
}
