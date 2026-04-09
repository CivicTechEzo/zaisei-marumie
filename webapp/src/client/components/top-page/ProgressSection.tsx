import "server-only";

export default function ProgressSection() {
  return (
    <div className="flex items-center self-stretch bg-gradient-to-tl from-[#BCECD3] to-[#64D8C6] rounded-[22px] p-8 sm:p-12">
      <div className="flex flex-col justify-center gap-2 sm:gap-[10.84px]">
        <div className="flex">
          <h2 className="text-xl sm:text-[27px] font-bold leading-[1.5] tracking-[-0.02em] text-gray-800 font-japanese">
            これはまだ第一歩。まちの財政をもっとわかりやすくしていきます
          </h2>
        </div>
        <p className="text-xs sm:text-base font-normal leading-[1.667] sm:leading-[1.75] tracking-[-0.01em] text-gray-800 font-japanese max-w-[874px]">
          住民のみなさんと一緒に、自治体財政の見える化を少しずつ進めていきます。
        </p>
      </div>
    </div>
  );
}
