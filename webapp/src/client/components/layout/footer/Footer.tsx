"use client";
import "client-only";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// テキストリンク集
const getTextLinks = (currentSlug: string) => [
  {
    label: "TOP",
    href: `/o/${currentSlug}/#top`,
  },
  {
    label: "歳入・歳出の流れ",
    href: `/o/${currentSlug}/#cash-flow`,
  },
  {
    label: "月ごとの収支推移",
    href: `/o/${currentSlug}/#monthly-trends`,
  },
  {
    label: "貸借対照表",
    href: `/o/${currentSlug}/#balance-sheet`,
  },
  {
    label: "すべての出入金",
    href: `/o/${currentSlug}/#transactions`,
  },
  {
    label: "データについて",
    href: `/o/${currentSlug}/#explanation`,
  },
  {
    label: "CivicTechEzo について",
    href: `/o/${currentSlug}/#about`,
  },
  {
    label: "利用規約",
    href: "/terms",
  },
  {
    label: "プライバシーポリシー",
    href: "/privacy",
  },
];

// SNSリンク集
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
  {
    name: "GitHub",
    href: "https://github.com/CivicTechEzo/zaisei-marumie",
    icon: "icon-github.svg",
  },
];

export default function Footer() {
  const pathname = usePathname();

  // 現在のslugを取得（/o/[slug]/... の形式の場合、なければdefaultを使用）
  const currentSlug = pathname.startsWith("/o/") ? pathname.split("/")[2] : "team-mirai";

  const textLinks = getTextLinks(currentSlug);

  const renderTextLink = (link: (typeof textLinks)[0]) => {
    const isExternal = link.href.startsWith("http");
    return (
      <Link
        key={link.href}
        href={link.href}
        className="text-gray-800 text-sm font-bold leading-[1.36em] hover:opacity-80 transition-opacity"
        {...(isExternal && { target: "_blank", rel: "noopener" })}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="w-full bg-gradient-to-tl from-[#BCECD3] to-[#64D8C6] px-8 lg:px-[117px] py-12 lg:pt-12 lg:pb-9">
      <div className="max-w-[1278px] mx-auto flex flex-col items-center gap-9 lg:gap-10">
        {/* Logo - PC版のみ表示 */}
        {/* TODO: CivicTechEzo ロゴアセット未作成。用意でき次第差し替え */}
        <div className="hidden lg:block w-[150px] h-[127px] relative">
          <Image
            src="/logos/team-mirai-logo.svg"
            alt="CivicTechEzo"
            fill
            className="object-contain"
          />
        </div>

        {/* Text Links */}
        {/* SP: 2カラム縦並び / PC: 2行横並び */}
        <div className="flex flex-col gap-4 items-center">
          {/* SP: 2カラム / PC: 1行目（最初の7つ）*/}
          <div className="flex gap-[48px] lg:gap-8">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-8">
              {textLinks.slice(0, 7).map(renderTextLink)}
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              {textLinks.slice(7).map(renderTextLink)}
            </div>
          </div>

          {/* PC: 2行目（残り）*/}
          <div className="hidden lg:flex gap-8">{textLinks.slice(7).map(renderTextLink)}</div>
        </div>

        {/* SNS Icons */}
        <div className="w-[299px] lg:w-auto">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener"
                className={`flex lg:flex-row items-center gap-1 lg:gap-1 hover:opacity-80 transition-opacity ${social.disabled ? "opacity-40 pointer-events-none" : ""}`}
                aria-label={social.disabled ? `${social.name}（準備中）` : social.name}
                title={social.disabled ? "準備中" : undefined}
              >
                <div className="w-12 h-12 lg:w-7 lg:h-7 rounded-full flex items-center justify-center relative bg-white">
                  <Image
                    src={`/images/social-icons/${social.icon}`}
                    alt={social.name}
                    width={48}
                    height={48}
                    className="lg:w-7 lg:h-7"
                  />
                </div>
                {/* PC版のみラベル表示 */}
                <span className="hidden lg:block text-base font-bold text-black">
                  {social.mainText || social.name}
                  {social.subText && (
                    <span className="text-xs ml-1 opacity-80">{social.subText}</span>
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Logo - SP版のみ表示 */}
        {/* TODO: CivicTechEzo ロゴアセット未作成。用意でき次第差し替え */}
        <div className="block lg:hidden w-[150px] h-[127px] relative">
          <Image
            src="/logos/team-mirai-logo.svg"
            alt="CivicTechEzo"
            fill
            className="object-contain"
          />
        </div>

        {/* Copyright */}
        <div className="w-full text-center">
          <p className="text-gray-600 text-sm leading-[1.25em]">
            © 2026 CivicTechEzo All rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
