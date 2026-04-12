import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import type { Seeder } from './seeds/lib/types';
import { tenantsSeeder } from './seeds/tenants';
import { usersSeeder } from './seeds/users';

const prisma = new PrismaClient();

// シーダーを配列で管理（順序も制御可能）
// テナントは最初に作成する必要がある（他のエンティティがテナントを参照するため）
const seeders: Seeder[] = [tenantsSeeder, usersSeeder];

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
