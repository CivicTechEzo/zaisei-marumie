import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/contexts/public-finance/infrastructure/prisma";
import { PrismaMunicipalityRepository } from "@/server/contexts/public-finance/infrastructure/repositories/prisma-municipality.repository";
import { GetMunicipalitiesUsecase } from "@/server/contexts/public-finance/application/usecases/get-organizations-usecase";
import { CACHE_REVALIDATE_SECONDS } from "./constants";

export const loadOrganizations = unstable_cache(
  async () => {
    const municipalityRepository = new PrismaMunicipalityRepository(prisma);
    const usecase = new GetMunicipalitiesUsecase(municipalityRepository);
    return await usecase.execute();
  },
  ["organizations"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["organizations"],
  },
);
