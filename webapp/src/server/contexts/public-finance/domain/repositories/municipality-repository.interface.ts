import type { Municipality } from "@/server/contexts/public-finance/domain/models/municipality";

export interface IMunicipalityRepository {
  findBySlug(slug: string): Promise<Municipality | null>;
  findAll(): Promise<Municipality[]>;
}
