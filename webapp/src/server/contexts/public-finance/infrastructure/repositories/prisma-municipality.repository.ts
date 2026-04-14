import "server-only";

import type { PrismaClient } from "@prisma/client";
import type { IMunicipalityRepository } from "@/server/contexts/public-finance/domain/repositories/municipality-repository.interface";
import type { Municipality } from "@/server/contexts/public-finance/domain/models/municipality";

export class PrismaMunicipalityRepository implements IMunicipalityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findBySlug(slug: string): Promise<Municipality | null> {
    const record = await this.prisma.municipality.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        displayName: true,
        municipalityCode: true,
        municipalityType: true,
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      slug: record.slug,
      displayName: record.displayName,
      municipalityCode: record.municipalityCode,
      municipalityType: record.municipalityType,
    };
  }

  async findAll(): Promise<Municipality[]> {
    const records = await this.prisma.municipality.findMany({
      select: {
        id: true,
        slug: true,
        displayName: true,
        municipalityCode: true,
        municipalityType: true,
      },
      orderBy: { municipalityCode: "asc" },
    });

    return records.map((r) => ({
      id: r.id,
      slug: r.slug,
      displayName: r.displayName,
      municipalityCode: r.municipalityCode,
      municipalityType: r.municipalityType,
    }));
  }
}
