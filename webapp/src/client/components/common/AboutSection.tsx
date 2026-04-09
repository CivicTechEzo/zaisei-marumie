import "server-only";
import Image from "next/image";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

const socialLinks = [
  {
    name: "webサイト",
    href: "https://fog-circle-b0e.notion.site/3327ecd908c88128b19df3cc4715d153",
    icon: "icon-web.svg",
  },
  {
    name: "X",
    mainText: "X",
    subText: "（旧Twitter）",
    href: "https://x.com/CivicTechEzo",
    icon: "icon-x.svg",
  },
  {
    name: "YouTube",
    href: "#",
    icon: "icon-yt.svg",
    disabled: true,
  },
  {
    name: "Facebook",
    href: "#",
    icon: "icon-fb.svg",
    disabled: true,
  },
];

export default function AboutSection() {
  return (
    <MainColumnCard id="about">
      <div className="space-y-9">
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
            CivicTechEzo について
          </h3>
          <p className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-700 font-medium sm:font-normal font-japanese">
            CivicTechEzo
            は、北海道を拠点にオープンデータやテクノロジーを活用して地域の課題解決に取り組むシビックテックコミュニティです。住民が地域の情報にアクセスしやすくなる仕組みづくりを目指しています。
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-0 sm:gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener"
                className={`flex flex-col items-center gap-1 sm:flex-row sm:gap-2 hover:bg-gray-50 transition-colors rounded-lg p-2 ${social.disabled ? "opacity-40 pointer-events-none" : ""}`}
                aria-label={social.disabled ? `${social.name}（準備中）` : social.name}
                title={social.disabled ? "準備中" : undefined}
              >
                <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative">
                  <Image
                    src={`/images/social-icons/${social.icon}`}
                    alt={social.name}
                    width={56}
                    height={56}
                    className="sm:w-12 sm:h-12"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  {social.subText ? (
                    <div className="flex items-baseline gap-1">
                      <div className="text-base font-bold text-black">
                        {social.mainText || social.name}
                      </div>
                      <div className="text-xs font-bold text-black opacity-80">
                        {social.subText}
                      </div>
                    </div>
                  ) : (
                    <div className="text-base font-bold text-black">
                      {social.mainText || social.name}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </MainColumnCard>
  );
}
