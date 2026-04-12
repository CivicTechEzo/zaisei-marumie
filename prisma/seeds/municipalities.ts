import type { MunicipalityType, PrismaClient } from '@prisma/client';
import type { Seeder } from './lib/types';

type MunicipalitySeed = {
  municipalityCode: string;
  displayName: string;
  municipalityType: MunicipalityType;
  regionCode: string;
};

/**
 * 北海道内179市町村 + 北海道（道）のシードデータ。
 * 全国地方公共団体コード（6桁、チェックディジット含む）を使用。
 */
const data: MunicipalitySeed[] = [
  // ── 石狩振興局 (8) ──
  { municipalityCode: '011002', displayName: '札幌市', municipalityType: 'city', regionCode: 'ishikari' },
  { municipalityCode: '012173', displayName: '江別市', municipalityType: 'city', regionCode: 'ishikari' },
  { municipalityCode: '012246', displayName: '千歳市', municipalityType: 'city', regionCode: 'ishikari' },
  { municipalityCode: '012319', displayName: '恵庭市', municipalityType: 'city', regionCode: 'ishikari' },
  { municipalityCode: '012343', displayName: '北広島市', municipalityType: 'city', regionCode: 'ishikari' },
  { municipalityCode: '012351', displayName: '石狩市', municipalityType: 'city', regionCode: 'ishikari' },
  { municipalityCode: '013030', displayName: '当別町', municipalityType: 'town', regionCode: 'ishikari' },
  { municipalityCode: '013048', displayName: '新篠津村', municipalityType: 'village', regionCode: 'ishikari' },

  // ── 空知総合振興局 (24) ──
  { municipalityCode: '012092', displayName: '夕張市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012106', displayName: '岩見沢市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012157', displayName: '美唄市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012165', displayName: '芦別市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012181', displayName: '赤平市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012220', displayName: '三笠市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012254', displayName: '滝川市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012262', displayName: '砂川市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012271', displayName: '歌志内市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '012289', displayName: '深川市', municipalityType: 'city', regionCode: 'sorachi' },
  { municipalityCode: '014231', displayName: '南幌町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014249', displayName: '奈井江町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014257', displayName: '上砂川町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014273', displayName: '由仁町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014281', displayName: '長沼町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014290', displayName: '栗山町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014303', displayName: '月形町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014311', displayName: '浦臼町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014320', displayName: '新十津川町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014338', displayName: '妹背牛町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014346', displayName: '秩父別町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014362', displayName: '雨竜町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014371', displayName: '北竜町', municipalityType: 'town', regionCode: 'sorachi' },
  { municipalityCode: '014389', displayName: '沼田町', municipalityType: 'town', regionCode: 'sorachi' },

  // ── 後志総合振興局 (20) ──
  { municipalityCode: '012033', displayName: '小樽市', municipalityType: 'city', regionCode: 'shiribeshi' },
  { municipalityCode: '013919', displayName: '島牧村', municipalityType: 'village', regionCode: 'shiribeshi' },
  { municipalityCode: '013927', displayName: '寿都町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '013935', displayName: '黒松内町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '013943', displayName: '蘭越町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '013951', displayName: 'ニセコ町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '013960', displayName: '真狩村', municipalityType: 'village', regionCode: 'shiribeshi' },
  { municipalityCode: '013978', displayName: '留寿都村', municipalityType: 'village', regionCode: 'shiribeshi' },
  { municipalityCode: '013986', displayName: '喜茂別町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '013994', displayName: '京極町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014001', displayName: '倶知安町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014010', displayName: '共和町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014028', displayName: '岩内町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014036', displayName: '泊村', municipalityType: 'village', regionCode: 'shiribeshi' },
  { municipalityCode: '014044', displayName: '神恵内村', municipalityType: 'village', regionCode: 'shiribeshi' },
  { municipalityCode: '014052', displayName: '積丹町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014061', displayName: '古平町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014079', displayName: '仁木町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014087', displayName: '余市町', municipalityType: 'town', regionCode: 'shiribeshi' },
  { municipalityCode: '014095', displayName: '赤井川村', municipalityType: 'village', regionCode: 'shiribeshi' },

  // ── 胆振総合振興局 (11) ──
  { municipalityCode: '012050', displayName: '室蘭市', municipalityType: 'city', regionCode: 'iburi' },
  { municipalityCode: '012131', displayName: '苫小牧市', municipalityType: 'city', regionCode: 'iburi' },
  { municipalityCode: '012301', displayName: '登別市', municipalityType: 'city', regionCode: 'iburi' },
  { municipalityCode: '012335', displayName: '伊達市', municipalityType: 'city', regionCode: 'iburi' },
  { municipalityCode: '015717', displayName: '豊浦町', municipalityType: 'town', regionCode: 'iburi' },
  { municipalityCode: '015750', displayName: '壮瞥町', municipalityType: 'town', regionCode: 'iburi' },
  { municipalityCode: '015784', displayName: '白老町', municipalityType: 'town', regionCode: 'iburi' },
  { municipalityCode: '015814', displayName: '厚真町', municipalityType: 'town', regionCode: 'iburi' },
  { municipalityCode: '015849', displayName: '洞爺湖町', municipalityType: 'town', regionCode: 'iburi' },
  { municipalityCode: '015857', displayName: '安平町', municipalityType: 'town', regionCode: 'iburi' },
  { municipalityCode: '015865', displayName: 'むかわ町', municipalityType: 'town', regionCode: 'iburi' },

  // ── 日高振興局 (7) ──
  { municipalityCode: '016012', displayName: '日高町', municipalityType: 'town', regionCode: 'hidaka' },
  { municipalityCode: '016021', displayName: '平取町', municipalityType: 'town', regionCode: 'hidaka' },
  { municipalityCode: '016047', displayName: '新冠町', municipalityType: 'town', regionCode: 'hidaka' },
  { municipalityCode: '016071', displayName: '浦河町', municipalityType: 'town', regionCode: 'hidaka' },
  { municipalityCode: '016080', displayName: '様似町', municipalityType: 'town', regionCode: 'hidaka' },
  { municipalityCode: '016098', displayName: 'えりも町', municipalityType: 'town', regionCode: 'hidaka' },
  { municipalityCode: '016101', displayName: '新ひだか町', municipalityType: 'town', regionCode: 'hidaka' },

  // ── 渡島総合振興局 (11) ──
  { municipalityCode: '012025', displayName: '函館市', municipalityType: 'city', regionCode: 'oshima' },
  { municipalityCode: '012360', displayName: '北斗市', municipalityType: 'city', regionCode: 'oshima' },
  { municipalityCode: '013315', displayName: '松前町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013323', displayName: '福島町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013331', displayName: '知内町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013340', displayName: '木古内町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013374', displayName: '七飯町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013439', displayName: '鹿部町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013455', displayName: '森町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013463', displayName: '八雲町', municipalityType: 'town', regionCode: 'oshima' },
  { municipalityCode: '013471', displayName: '長万部町', municipalityType: 'town', regionCode: 'oshima' },

  // ── 檜山振興局 (7) ──
  { municipalityCode: '013617', displayName: '江差町', municipalityType: 'town', regionCode: 'hiyama' },
  { municipalityCode: '013625', displayName: '上ノ国町', municipalityType: 'town', regionCode: 'hiyama' },
  { municipalityCode: '013633', displayName: '厚沢部町', municipalityType: 'town', regionCode: 'hiyama' },
  { municipalityCode: '013641', displayName: '乙部町', municipalityType: 'town', regionCode: 'hiyama' },
  { municipalityCode: '013676', displayName: '奥尻町', municipalityType: 'town', regionCode: 'hiyama' },
  { municipalityCode: '013706', displayName: '今金町', municipalityType: 'town', regionCode: 'hiyama' },
  { municipalityCode: '013714', displayName: 'せたな町', municipalityType: 'town', regionCode: 'hiyama' },

  // ── 上川総合振興局 (23) ──
  { municipalityCode: '012041', displayName: '旭川市', municipalityType: 'city', regionCode: 'kamikawa' },
  { municipalityCode: '012203', displayName: '士別市', municipalityType: 'city', regionCode: 'kamikawa' },
  { municipalityCode: '012211', displayName: '名寄市', municipalityType: 'city', regionCode: 'kamikawa' },
  { municipalityCode: '012297', displayName: '富良野市', municipalityType: 'city', regionCode: 'kamikawa' },
  { municipalityCode: '014524', displayName: '鷹栖町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014532', displayName: '東神楽町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014541', displayName: '当麻町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014559', displayName: '比布町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014567', displayName: '愛別町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014575', displayName: '上川町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014583', displayName: '東川町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014591', displayName: '美瑛町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014605', displayName: '上富良野町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014613', displayName: '中富良野町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014621', displayName: '南富良野町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014630', displayName: '占冠村', municipalityType: 'village', regionCode: 'kamikawa' },
  { municipalityCode: '014648', displayName: '和寒町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014656', displayName: '剣淵町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014681', displayName: '下川町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014699', displayName: '美深町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014702', displayName: '音威子府村', municipalityType: 'village', regionCode: 'kamikawa' },
  { municipalityCode: '014711', displayName: '中川町', municipalityType: 'town', regionCode: 'kamikawa' },
  { municipalityCode: '014729', displayName: '幌加内町', municipalityType: 'town', regionCode: 'kamikawa' },

  // ── 留萌振興局 (8) ──
  { municipalityCode: '012122', displayName: '留萌市', municipalityType: 'city', regionCode: 'rumoi' },
  { municipalityCode: '014818', displayName: '増毛町', municipalityType: 'town', regionCode: 'rumoi' },
  { municipalityCode: '014826', displayName: '小平町', municipalityType: 'town', regionCode: 'rumoi' },
  { municipalityCode: '014834', displayName: '苫前町', municipalityType: 'town', regionCode: 'rumoi' },
  { municipalityCode: '014842', displayName: '羽幌町', municipalityType: 'town', regionCode: 'rumoi' },
  { municipalityCode: '014851', displayName: '初山別村', municipalityType: 'village', regionCode: 'rumoi' },
  { municipalityCode: '014869', displayName: '遠別町', municipalityType: 'town', regionCode: 'rumoi' },
  { municipalityCode: '014877', displayName: '天塩町', municipalityType: 'town', regionCode: 'rumoi' },

  // ── 宗谷総合振興局 (10) ──
  { municipalityCode: '012149', displayName: '稚内市', municipalityType: 'city', regionCode: 'soya' },
  { municipalityCode: '015113', displayName: '猿払村', municipalityType: 'village', regionCode: 'soya' },
  { municipalityCode: '015121', displayName: '浜頓別町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015130', displayName: '中頓別町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015148', displayName: '枝幸町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015164', displayName: '豊富町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015172', displayName: '礼文町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015181', displayName: '利尻町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015199', displayName: '利尻富士町', municipalityType: 'town', regionCode: 'soya' },
  { municipalityCode: '015202', displayName: '幌延町', municipalityType: 'town', regionCode: 'soya' },

  // ── オホーツク総合振興局 (18) ──
  { municipalityCode: '012084', displayName: '北見市', municipalityType: 'city', regionCode: 'okhotsk' },
  { municipalityCode: '012114', displayName: '網走市', municipalityType: 'city', regionCode: 'okhotsk' },
  { municipalityCode: '012190', displayName: '紋別市', municipalityType: 'city', regionCode: 'okhotsk' },
  { municipalityCode: '015431', displayName: '美幌町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015440', displayName: '津別町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015458', displayName: '斜里町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015466', displayName: '清里町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015474', displayName: '小清水町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015491', displayName: '訓子府町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015504', displayName: '置戸町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015521', displayName: '佐呂間町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015555', displayName: '遠軽町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015598', displayName: '湧別町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015601', displayName: '滝上町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015610', displayName: '興部町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015628', displayName: '西興部村', municipalityType: 'village', regionCode: 'okhotsk' },
  { municipalityCode: '015636', displayName: '雄武町', municipalityType: 'town', regionCode: 'okhotsk' },
  { municipalityCode: '015644', displayName: '大空町', municipalityType: 'town', regionCode: 'okhotsk' },

  // ── 十勝総合振興局 (19) ──
  { municipalityCode: '012076', displayName: '帯広市', municipalityType: 'city', regionCode: 'tokachi' },
  { municipalityCode: '016314', displayName: '音更町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016322', displayName: '士幌町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016331', displayName: '上士幌町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016349', displayName: '鹿追町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016357', displayName: '新得町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016365', displayName: '清水町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016373', displayName: '芽室町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016381', displayName: '中札内村', municipalityType: 'village', regionCode: 'tokachi' },
  { municipalityCode: '016390', displayName: '更別村', municipalityType: 'village', regionCode: 'tokachi' },
  { municipalityCode: '016411', displayName: '大樹町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016420', displayName: '広尾町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016438', displayName: '幕別町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016446', displayName: '池田町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016454', displayName: '豊頃町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016462', displayName: '本別町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016471', displayName: '足寄町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016489', displayName: '陸別町', municipalityType: 'town', regionCode: 'tokachi' },
  { municipalityCode: '016497', displayName: '浦幌町', municipalityType: 'town', regionCode: 'tokachi' },

  // ── 釧路総合振興局 (8) ──
  { municipalityCode: '012068', displayName: '釧路市', municipalityType: 'city', regionCode: 'kushiro' },
  { municipalityCode: '016616', displayName: '釧路町', municipalityType: 'town', regionCode: 'kushiro' },
  { municipalityCode: '016624', displayName: '厚岸町', municipalityType: 'town', regionCode: 'kushiro' },
  { municipalityCode: '016632', displayName: '浜中町', municipalityType: 'town', regionCode: 'kushiro' },
  { municipalityCode: '016641', displayName: '標茶町', municipalityType: 'town', regionCode: 'kushiro' },
  { municipalityCode: '016659', displayName: '弟子屈町', municipalityType: 'town', regionCode: 'kushiro' },
  { municipalityCode: '016675', displayName: '鶴居村', municipalityType: 'village', regionCode: 'kushiro' },
  { municipalityCode: '016683', displayName: '白糠町', municipalityType: 'town', regionCode: 'kushiro' },

  // ── 根室振興局 (5) ──
  { municipalityCode: '012238', displayName: '根室市', municipalityType: 'city', regionCode: 'nemuro' },
  { municipalityCode: '016918', displayName: '別海町', municipalityType: 'town', regionCode: 'nemuro' },
  { municipalityCode: '016926', displayName: '中標津町', municipalityType: 'town', regionCode: 'nemuro' },
  { municipalityCode: '016934', displayName: '標津町', municipalityType: 'town', regionCode: 'nemuro' },
  { municipalityCode: '016942', displayName: '羅臼町', municipalityType: 'town', regionCode: 'nemuro' },
];

function toSlug(displayName: string, municipalityCode: string): string {
  return `hokkaido-${municipalityCode}`;
}

export const municipalitiesSeeder: Seeder = {
  name: 'Municipalities',
  async seed(prisma: PrismaClient) {
    const regions = await prisma.region.findMany();
    const regionMap = new Map(regions.map((r) => [r.code, r.id]));

    let created = 0;
    let skipped = 0;

    for (const item of data) {
      const regionId = regionMap.get(item.regionCode);
      if (!regionId) {
        console.log(`⚠️  Region not found: ${item.regionCode}, skipping ${item.displayName}`);
        continue;
      }

      const existing = await prisma.municipality.findUnique({
        where: { municipalityCode: item.municipalityCode },
      });

      if (!existing) {
        await prisma.municipality.create({
          data: {
            displayName: item.displayName,
            slug: toSlug(item.displayName, item.municipalityCode),
            municipalityCode: item.municipalityCode,
            municipalityType: item.municipalityType,
            regionId,
          },
        });
        created++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Created: ${created}, ⏭️  Already exists: ${skipped}`);
  },
};
