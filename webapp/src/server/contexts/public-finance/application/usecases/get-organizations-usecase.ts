import "server-only";

import type { IMunicipalityRepository } from "@/server/contexts/public-finance/domain/repositories/municipality-repository.interface";
import type { OrganizationsResponse, OrganizationData } from "@/types/organization";

export class GetMunicipalitiesUsecase {
  constructor(private municipalityRepository: IMunicipalityRepository) {}

  async execute(): Promise<OrganizationsResponse> {
    try {
      const municipalities = await this.municipalityRepository.findAll();

      if (municipalities.length === 0) {
        return {
          default: null,
          organizations: [],
        };
      }

      const organizationData: OrganizationData[] = municipalities.map((m) => ({
        slug: m.slug,
        orgName: m.displayName,
        displayName: m.displayName,
      }));

      return {
        default: organizationData[0].slug,
        organizations: organizationData,
      };
    } catch (error) {
      throw new Error(
        `Failed to get municipalities: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
