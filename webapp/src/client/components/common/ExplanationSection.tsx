import "server-only";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

export default function ExplanationSection() {
  return (
    <MainColumnCard id="explanation">
      <div className="space-y-9">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
            自治体財政まる見えについて
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese">
            本プロジェクトは、北海道のシビックテックコミュニティ「CivicTechEzo」が、自治体の財政状況を住民にわかりやすく届けることを目的に開発しているオープンソースソフトウェアです。ソースコードは
            <a
              href="https://github.com/CivicTechEzo/zaisei-marumie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#238778] underline hover:no-underline"
            >
              GitHub
            </a>
            にて公開しています。
          </p>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
            データの出典
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese">
            本サイトに掲載している財政データは、総務省が公表している「市町村別決算状況調」に基づいています。
          </p>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
            免責事項
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese">
            本サイトで公開するデータは、可能な限り正確かつ最新の情報を反映するよう努めていますが、その正確性・完全性・即時性について保証するものではありません。正式な財政情報は、総務省の公表データおよび各自治体の決算書等の公式資料をご確認ください。
          </p>
        </div>
      </div>
    </MainColumnCard>
  );
}
