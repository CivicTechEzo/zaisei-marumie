import "server-only";
import { loadOrganizations } from "@/server/contexts/public-finance/presentation/loaders/load-organizations";
import { loadAllAvailableYears } from "@/server/contexts/public-finance/presentation/loaders/load-available-years";
import HeaderClient from "@/client/components/layout/header/HeaderClient";

export default async function Header() {
  const [organizationsData, availableYears] = await Promise.all([
    loadOrganizations(),
    loadAllAvailableYears(),
  ]);

  return <HeaderClient organizations={organizationsData} availableYears={availableYears} />;
}
