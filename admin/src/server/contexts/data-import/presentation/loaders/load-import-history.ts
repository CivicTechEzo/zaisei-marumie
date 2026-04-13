import "server-only";

/**
 * load-import-history loader
 *
 * インポート済み年度一覧を返すサーバーサイドデータ取得処理。
 */

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PrismaSettlementRepository } from "@/server/contexts/data-import/infrastructure/repositories/prisma-settlement.repository";

const CACHE_REVALIDATE_SECONDS = 60;

const fetchImportedFiscalYears = unstable_cache(
  async (): Promise<number[]> => {
    const repository = new PrismaSettlementRepository(prisma);
    return repository.findImportedFiscalYears();
  },
  ["imported-fiscal-years"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["settlement-data"] },
);

export async function loadImportedFiscalYears(): Promise<number[]> {
  return fetchImportedFiscalYears();
}
