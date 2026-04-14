import "server-only";
import { redirect } from "next/navigation";
import { loadMunicipalities } from "@/server/contexts/public-finance/presentation/loaders/load-municipalities";

export default async function NotFound() {
  const { default: defaultSlug } = await loadMunicipalities();

  if (defaultSlug) {
    redirect(`/o/${defaultSlug}`);
  } else {
    // 自治体が存在しない場合はルートページにリダイレクト
    redirect("/");
  }
}
