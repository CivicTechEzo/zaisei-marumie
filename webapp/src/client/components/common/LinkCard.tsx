import Image from "next/image";

interface LinkCardProps {
  title: string;
  href: string;
}

const OUTERLINK_ICON = "/icons/icon-outerlink.svg";

export default function LinkCard({ title, href }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex-1 bg-white border border-black rounded-2xl md:rounded-3xl hover:bg-gray-50 transition-colors p-4 px-6 md:px-12 md:py-9"
    >
      <div className="flex items-center justify-center gap-4 md:justify-between md:gap-6">
        <h3 className="text-lg md:text-[27px] font-bold text-gray-800 leading-tight md:flex-1">
          {title}
        </h3>
        <div className="w-4 h-4 md:w-[22px] md:h-[22px] flex-shrink-0">
          <Image src={OUTERLINK_ICON} alt="" width={22} height={22} className="w-full h-full" />
        </div>
      </div>
    </a>
  );
}
