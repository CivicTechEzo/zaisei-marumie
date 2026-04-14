import "server-only";

import type { PrismaClient } from "@prisma/client";
import type {
  IMunicipalityRepository,
  MunicipalityData,
} from "@/server/contexts/public-finance/domain/repositories/municipality-repository.interface";

export class PrismaMunicipalityRepository implements IMunicipalityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findBySlug(slug: string): Promise<MunicipalityData | null> {
    return this.prisma.municipality.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        displayName: true,
        municipalityCode: true,
      },
    });
  }

  async findBySlugs(slugs: string[]): Promise<MunicipalityData[]> {
    return this.prisma.municipality.findMany({
      where: { slug: { in: slugs } },
      select: {
        id: true,
        slug: true,
        displayName: true,
        municipalityCode: true,
      },
    });
  }

  async findAll(): Promise<MunicipalityData[]> {
    return this.prisma.municipality.findMany({
      select: {
        id: true,
        slug: true,
        displayName: true,
        municipalityCode: true,
      },
      orderBy: { municipalityCode: "asc" },
    });
  }
}
