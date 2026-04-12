import "server-only";

/**
 * 北海道の総合振興局・振興局の定義と、自治体コードから振興局への逆引きマッピング。
 * 振興局の区分は2010年の再編以降変更がなく、安定した参照データのため定数として管理する。
 */

export type RegionCode =
  | "ishikari"
  | "sorachi"
  | "shiribeshi"
  | "iburi"
  | "hidaka"
  | "oshima"
  | "hiyama"
  | "kamikawa"
  | "rumoi"
  | "soya"
  | "okhotsk"
  | "tokachi"
  | "kushiro"
  | "nemuro";

export type HokkaidoRegion = {
  readonly code: RegionCode;
  readonly name: string;
  readonly shortName: string;
};

export const HOKKAIDO_REGIONS: readonly HokkaidoRegion[] = [
  { code: "ishikari", name: "石狩振興局", shortName: "石狩" },
  { code: "sorachi", name: "空知総合振興局", shortName: "空知" },
  { code: "shiribeshi", name: "後志総合振興局", shortName: "後志" },
  { code: "iburi", name: "胆振総合振興局", shortName: "胆振" },
  { code: "hidaka", name: "日高振興局", shortName: "日高" },
  { code: "oshima", name: "渡島総合振興局", shortName: "渡島" },
  { code: "hiyama", name: "檜山振興局", shortName: "檜山" },
  { code: "kamikawa", name: "上川総合振興局", shortName: "上川" },
  { code: "rumoi", name: "留萌振興局", shortName: "留萌" },
  { code: "soya", name: "宗谷総合振興局", shortName: "宗谷" },
  { code: "okhotsk", name: "オホーツク総合振興局", shortName: "オホーツク" },
  { code: "tokachi", name: "十勝総合振興局", shortName: "十勝" },
  { code: "kushiro", name: "釧路総合振興局", shortName: "釧路" },
  { code: "nemuro", name: "根室振興局", shortName: "根室" },
] as const;

/**
 * 自治体コード（6桁） → 振興局コード のマッピング。
 * 北海道庁の振興局管轄区域に基づく。
 */
export const MUNICIPALITY_TO_REGION: Readonly<Record<string, RegionCode>> = {
  // ── 石狩振興局 (8) ──
  "011002": "ishikari", // 札幌市
  "012173": "ishikari", // 江別市
  "012246": "ishikari", // 千歳市
  "012319": "ishikari", // 恵庭市
  "012343": "ishikari", // 北広島市
  "012351": "ishikari", // 石狩市
  "013030": "ishikari", // 当別町
  "013048": "ishikari", // 新篠津村

  // ── 空知総合振興局 (24) ──
  "012092": "sorachi", // 夕張市
  "012106": "sorachi", // 岩見沢市
  "012157": "sorachi", // 美唄市
  "012165": "sorachi", // 芦別市
  "012181": "sorachi", // 赤平市
  "012220": "sorachi", // 三笠市
  "012254": "sorachi", // 滝川市
  "012262": "sorachi", // 砂川市
  "012271": "sorachi", // 歌志内市
  "012289": "sorachi", // 深川市
  "014231": "sorachi", // 南幌町
  "014249": "sorachi", // 奈井江町
  "014257": "sorachi", // 上砂川町
  "014273": "sorachi", // 由仁町
  "014281": "sorachi", // 長沼町
  "014290": "sorachi", // 栗山町
  "014303": "sorachi", // 月形町
  "014311": "sorachi", // 浦臼町
  "014320": "sorachi", // 新十津川町
  "014338": "sorachi", // 妹背牛町
  "014346": "sorachi", // 秩父別町
  "014362": "sorachi", // 雨竜町
  "014371": "sorachi", // 北竜町
  "014389": "sorachi", // 沼田町

  // ── 後志総合振興局 (20) ──
  "012033": "shiribeshi", // 小樽市
  "013919": "shiribeshi", // 島牧村
  "013927": "shiribeshi", // 寿都町
  "013935": "shiribeshi", // 黒松内町
  "013943": "shiribeshi", // 蘭越町
  "013951": "shiribeshi", // ニセコ町
  "013960": "shiribeshi", // 真狩村
  "013978": "shiribeshi", // 留寿都村
  "013986": "shiribeshi", // 喜茂別町
  "013994": "shiribeshi", // 京極町
  "014001": "shiribeshi", // 倶知安町
  "014010": "shiribeshi", // 共和町
  "014028": "shiribeshi", // 岩内町
  "014036": "shiribeshi", // 泊村
  "014044": "shiribeshi", // 神恵内村
  "014052": "shiribeshi", // 積丹町
  "014061": "shiribeshi", // 古平町
  "014079": "shiribeshi", // 仁木町
  "014087": "shiribeshi", // 余市町
  "014095": "shiribeshi", // 赤井川村

  // ── 胆振総合振興局 (11) ──
  "012050": "iburi", // 室蘭市
  "012131": "iburi", // 苫小牧市
  "012301": "iburi", // 登別市
  "012335": "iburi", // 伊達市
  "015717": "iburi", // 豊浦町
  "015750": "iburi", // 壮瞥町
  "015784": "iburi", // 白老町
  "015814": "iburi", // 厚真町
  "015849": "iburi", // 洞爺湖町
  "015857": "iburi", // 安平町
  "015865": "iburi", // むかわ町

  // ── 日高振興局 (7) ──
  "016012": "hidaka", // 日高町
  "016021": "hidaka", // 平取町
  "016047": "hidaka", // 新冠町
  "016071": "hidaka", // 浦河町
  "016080": "hidaka", // 様似町
  "016098": "hidaka", // えりも町
  "016101": "hidaka", // 新ひだか町

  // ── 渡島総合振興局 (11) ──
  "012025": "oshima", // 函館市
  "012360": "oshima", // 北斗市
  "013315": "oshima", // 松前町
  "013323": "oshima", // 福島町
  "013331": "oshima", // 知内町
  "013340": "oshima", // 木古内町
  "013374": "oshima", // 七飯町
  "013439": "oshima", // 鹿部町
  "013455": "oshima", // 森町
  "013463": "oshima", // 八雲町
  "013471": "oshima", // 長万部町

  // ── 檜山振興局 (7) ──
  "013617": "hiyama", // 江差町
  "013625": "hiyama", // 上ノ国町
  "013633": "hiyama", // 厚沢部町
  "013641": "hiyama", // 乙部町
  "013676": "hiyama", // 奥尻町
  "013706": "hiyama", // 今金町
  "013714": "hiyama", // せたな町

  // ── 上川総合振興局 (23) ──
  "012041": "kamikawa", // 旭川市
  "012203": "kamikawa", // 士別市
  "012211": "kamikawa", // 名寄市
  "012297": "kamikawa", // 富良野市
  "014524": "kamikawa", // 鷹栖町
  "014532": "kamikawa", // 東神楽町
  "014541": "kamikawa", // 当麻町
  "014559": "kamikawa", // 比布町
  "014567": "kamikawa", // 愛別町
  "014575": "kamikawa", // 上川町
  "014583": "kamikawa", // 東川町
  "014591": "kamikawa", // 美瑛町
  "014605": "kamikawa", // 上富良野町
  "014613": "kamikawa", // 中富良野町
  "014621": "kamikawa", // 南富良野町
  "014630": "kamikawa", // 占冠村
  "014648": "kamikawa", // 和寒町
  "014656": "kamikawa", // 剣淵町
  "014681": "kamikawa", // 下川町
  "014699": "kamikawa", // 美深町
  "014702": "kamikawa", // 音威子府村
  "014711": "kamikawa", // 中川町
  "014729": "kamikawa", // 幌加内町

  // ── 留萌振興局 (8) ──
  "012122": "rumoi", // 留萌市
  "014818": "rumoi", // 増毛町
  "014826": "rumoi", // 小平町
  "014834": "rumoi", // 苫前町
  "014842": "rumoi", // 羽幌町
  "014851": "rumoi", // 初山別村
  "014869": "rumoi", // 遠別町
  "014877": "rumoi", // 天塩町

  // ── 宗谷総合振興局 (10) ──
  "012149": "soya", // 稚内市
  "015113": "soya", // 猿払村
  "015121": "soya", // 浜頓別町
  "015130": "soya", // 中頓別町
  "015148": "soya", // 枝幸町
  "015164": "soya", // 豊富町
  "015172": "soya", // 礼文町
  "015181": "soya", // 利尻町
  "015199": "soya", // 利尻富士町
  "015202": "soya", // 幌延町

  // ── オホーツク総合振興局 (18) ──
  "012084": "okhotsk", // 北見市
  "012114": "okhotsk", // 網走市
  "012190": "okhotsk", // 紋別市
  "015431": "okhotsk", // 美幌町
  "015440": "okhotsk", // 津別町
  "015458": "okhotsk", // 斜里町
  "015466": "okhotsk", // 清里町
  "015474": "okhotsk", // 小清水町
  "015491": "okhotsk", // 訓子府町
  "015504": "okhotsk", // 置戸町
  "015521": "okhotsk", // 佐呂間町
  "015555": "okhotsk", // 遠軽町
  "015598": "okhotsk", // 湧別町
  "015601": "okhotsk", // 滝上町
  "015610": "okhotsk", // 興部町
  "015628": "okhotsk", // 西興部村
  "015636": "okhotsk", // 雄武町
  "015644": "okhotsk", // 大空町

  // ── 十勝総合振興局 (19) ──
  "012076": "tokachi", // 帯広市
  "016314": "tokachi", // 音更町
  "016322": "tokachi", // 士幌町
  "016331": "tokachi", // 上士幌町
  "016349": "tokachi", // 鹿追町
  "016357": "tokachi", // 新得町
  "016365": "tokachi", // 清水町
  "016373": "tokachi", // 芽室町
  "016381": "tokachi", // 中札内村
  "016390": "tokachi", // 更別村
  "016411": "tokachi", // 大樹町
  "016420": "tokachi", // 広尾町
  "016438": "tokachi", // 幕別町
  "016446": "tokachi", // 池田町
  "016454": "tokachi", // 豊頃町
  "016462": "tokachi", // 本別町
  "016471": "tokachi", // 足寄町
  "016489": "tokachi", // 陸別町
  "016497": "tokachi", // 浦幌町

  // ── 釧路総合振興局 (8) ──
  "012068": "kushiro", // 釧路市
  "016616": "kushiro", // 釧路町
  "016624": "kushiro", // 厚岸町
  "016632": "kushiro", // 浜中町
  "016641": "kushiro", // 標茶町
  "016659": "kushiro", // 弟子屈町
  "016675": "kushiro", // 鶴居村
  "016683": "kushiro", // 白糠町

  // ── 根室振興局 (5) ──
  "012238": "nemuro", // 根室市
  "016918": "nemuro", // 別海町
  "016926": "nemuro", // 中標津町
  "016934": "nemuro", // 標津町
  "016942": "nemuro", // 羅臼町
};

/** 振興局コードから振興局情報を取得する */
export function getRegionByCode(code: RegionCode): HokkaidoRegion {
  const region = HOKKAIDO_REGIONS.find((r) => r.code === code);
  if (!region) {
    throw new Error(`Unknown region code: ${code}`);
  }
  return region;
}

/** 自治体コードから所属する振興局コードを取得する */
export function getRegionCodeByMunicipalityCode(municipalityCode: string): RegionCode | undefined {
  return MUNICIPALITY_TO_REGION[municipalityCode];
}

/** 指定した振興局に属する自治体コード一覧を取得する */
export function getMunicipalityCodesByRegion(regionCode: RegionCode): string[] {
  return Object.entries(MUNICIPALITY_TO_REGION)
    .filter(([, region]) => region === regionCode)
    .map(([code]) => code);
}
