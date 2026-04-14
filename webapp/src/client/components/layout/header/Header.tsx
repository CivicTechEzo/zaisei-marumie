import "server-only";
import { loadMunicipalities } from "@/server/contexts/public-finance/presentation/loaders/load-municipalities";
import { loadAllAvailableYears } from "@/server/contexts/public-finance/presentation/loaders/load-available-years";
import HeaderClient from "@/client/components/layout/header/HeaderClient";

export default async function Header() {
  const [municipalitiesData, availableYears] = await Promise.all([
    loadMunicipalities(),
    loadAllAvailableYears(),
  ]);

  return <HeaderClient municipalities={municipalitiesData} availableYears={availableYears} />;
}
