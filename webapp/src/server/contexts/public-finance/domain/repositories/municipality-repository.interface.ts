export interface MunicipalityData {
  id: bigint;
  slug: string;
  displayName: string;
  municipalityCode: string;
}

export interface IMunicipalityRepository {
  findBySlug(slug: string): Promise<MunicipalityData | null>;
  findBySlugs(slugs: string[]): Promise<MunicipalityData[]>;
  findAll(): Promise<MunicipalityData[]>;
}
