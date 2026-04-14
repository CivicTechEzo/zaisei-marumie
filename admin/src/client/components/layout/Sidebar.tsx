"use client";
import "client-only";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/server/contexts/auth/domain/models/user-role";
import { Button } from "@/client/components/ui";

type NavItem = {
  href: string;
  label: string;
  adminOnly?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

export default function Sidebar({
  logoutAction,
  userRole,
}: {
  logoutAction: (formData: FormData) => Promise<void>;
  userRole: UserRole | null;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navSections: NavSection[] = [
    {
      title: "基本情報",
      items: [
        { href: "/user-info", label: "ユーザー情報" },
        { href: "/users", label: "ユーザー管理", adminOnly: true },
      ],
    },
    {
      title: "データ取り込み",
      items: [
        { href: "/import-settlement", label: "財政データ取り込み" },
      ],
    },
  ];

  return (
    <aside className="bg-card p-4 flex flex-col h-full">
      <nav className="flex flex-col gap-6">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.adminOnly || userRole === "admin",
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1 px-2.5">
                {section.title}
              </h3>
              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-foreground no-underline px-2.5 py-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.href) ? "bg-secondary" : "hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="mt-auto pt-4">
        <form action={logoutAction}>
          <Button type="submit" variant="destructive" className="w-full">
            ログアウト
          </Button>
        </form>
      </div>
    </aside>
  );
}
