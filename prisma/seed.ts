import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import type { Seeder } from './seeds/lib/types';
import { municipalitiesSeeder } from './seeds/municipalities';
import { regionsSeeder } from './seeds/regions';
import { tenantsSeeder } from './seeds/tenants';
import { usersSeeder } from './seeds/users';

const prisma = new PrismaClient();

// シーダーを配列で管理（順序も制御可能）
// テナント → 振興局 → 自治体 の順で作成する必要がある（FK依存）
const seeders: Seeder[] = [tenantsSeeder, usersSeeder, regionsSeeder, municipalitiesSeeder];

async function main() {
  console.log('🌱 Seeding database...\n');

  for (const seeder of seeders) {
    console.log(`📦 ${seeder.name}...`);
    await seeder.seed(prisma);
    console.log('');
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
