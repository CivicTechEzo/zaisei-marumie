import type { Prisma, PrismaClient } from '@prisma/client';
import type { Seeder } from './lib/types';

const data: Prisma.TenantCreateInput[] = [
  {
    name: '開発用テナント',
    slug: 'dev-tenant',
    description: '開発・動作確認用テナント',
  },
];

export const tenantsSeeder: Seeder = {
  name: 'Tenants',
  async seed(prisma: PrismaClient) {
    for (const item of data) {
      const existing = await prisma.tenant.findFirst({
        where: { slug: item.slug },
      });

      if (!existing) {
        const created = await prisma.tenant.create({ data: item });
        console.log(`✅ Created: ${created.slug}`);
      } else {
        console.log(`⏭️  Already exists: ${existing.slug}`);
      }
    }
  },
};
