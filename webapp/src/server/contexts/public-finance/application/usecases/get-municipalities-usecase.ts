import "server-only";

import type { IMunicipalityRepository } from "@/server/contexts/public-finance/domain/repositories/municipality-repository.interface";
import type { MunicipalitiesResponse, MunicipalityData } from "@/types/municipality";

export class GetMunicipalitiesUsecase {
  constructor(private municipalityRepository: IMunicipalityRepository) {}

  async execute(): Promise<MunicipalitiesResponse> {
    const municipalities = await this.municipalityRepository.findAll();

    if (municipalities.length === 0) {
      return {
        default: null,
        municipalities: [],
      };
    }

    const municipalityData: MunicipalityData[] = municipalities.map((m) => ({
      slug: m.slug,
      displayName: m.displayName,
    }));

    return {
      default: municipalityData[0].slug,
      municipalities: municipalityData,
    };
  }
}
