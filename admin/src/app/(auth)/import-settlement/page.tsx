import "server-only";

import { loadImportedFiscalYears } from "@/server/contexts/data-import/presentation/loaders/load-import-history";
import SettlementImportClient from "@/client/components/settlement-import/SettlementImportClient";

export default async function ImportSettlementPage() {
  const importedYears = await loadImportedFiscalYears();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">財政データ取り込み</h1>
      <p className="text-muted-foreground mb-6">
        総務省「市町村別決算状況調べ」のExcelファイルからデータを取得し、北海道内の自治体の決算データをインポートします。
      </p>
      <SettlementImportClient importedYears={importedYears} />
    </div>
  );
}
