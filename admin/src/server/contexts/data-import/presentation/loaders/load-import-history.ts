import "server-only";

/**
 * load-import-history loader
 *
 * インポート済み年度一覧を返すサーバーサイドデータ取得処理。
 */

import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { PrismaSettlementRepository } from "@/server/contexts/data-import/infrastructure/repositories/prisma-settlement.repository";

const repository = new PrismaSettlementRepository(prisma);

export async function loadImportedFiscalYears(): Promise<number[]> {
  return repository.findImportedFiscalYears();
}
