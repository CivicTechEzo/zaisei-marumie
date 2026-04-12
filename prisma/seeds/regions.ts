import type { PrismaClient } from '@prisma/client';
import type { Seeder } from './lib/types';

const data = [
  { code: 'ishikari', name: '石狩振興局', shortName: '石狩', sortOrder: 1 },
  { code: 'sorachi', name: '空知総合振興局', shortName: '空知', sortOrder: 2 },
  { code: 'shiribeshi', name: '後志総合振興局', shortName: '後志', sortOrder: 3 },
  { code: 'iburi', name: '胆振総合振興局', shortName: '胆振', sortOrder: 4 },
  { code: 'hidaka', name: '日高振興局', shortName: '日高', sortOrder: 5 },
  { code: 'oshima', name: '渡島総合振興局', shortName: '渡島', sortOrder: 6 },
  { code: 'hiyama', name: '檜山振興局', shortName: '檜山', sortOrder: 7 },
  { code: 'kamikawa', name: '上川総合振興局', shortName: '上川', sortOrder: 8 },
  { code: 'rumoi', name: '留萌振興局', shortName: '留萌', sortOrder: 9 },
  { code: 'soya', name: '宗谷総合振興局', shortName: '宗谷', sortOrder: 10 },
  { code: 'okhotsk', name: 'オホーツク総合振興局', shortName: 'オホーツク', sortOrder: 11 },
  { code: 'tokachi', name: '十勝総合振興局', shortName: '十勝', sortOrder: 12 },
  { code: 'kushiro', name: '釧路総合振興局', shortName: '釧路', sortOrder: 13 },
  { code: 'nemuro', name: '根室振興局', shortName: '根室', sortOrder: 14 },
] as const;

export const regionsSeeder: Seeder = {
  name: 'Regions',
  async seed(prisma: PrismaClient) {
    for (const item of data) {
      const existing = await prisma.region.findUnique({ where: { code: item.code } });

      if (!existing) {
        await prisma.region.create({
          data: {
            code: item.code,
            name: item.name,
            shortName: item.shortName,
            sortOrder: item.sortOrder,
          },
        });
        console.log(`✅ Created: ${item.name}`);
      } else {
        console.log(`⏭️  Already exists: ${existing.name}`);
      }
    }
  },
};
