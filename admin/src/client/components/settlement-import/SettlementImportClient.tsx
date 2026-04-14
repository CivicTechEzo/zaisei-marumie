"use client";
import "client-only";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui";
import { FISCAL_YEAR_OPTIONS } from "@/server/contexts/data-import/presentation/types";
import { fetchSettlementPreview } from "@/server/contexts/data-import/presentation/actions/fetch-settlement-preview";
import type {
  FetchSettlementPreviewResult,
  SerializedSettlementPreview,
  SerializedPreviewSummary,
} from "@/server/contexts/data-import/presentation/actions/fetch-settlement-preview";
import { importSettlementData } from "@/server/contexts/data-import/presentation/actions/import-settlement-data";
import type { ImportSettlementResult } from "@/server/contexts/data-import/presentation/actions/import-settlement-data";

interface Props {
  importedYears: number[];
}

type Step = "select" | "preview" | "result";

function formatAmount(amountStr: string): string {
  const num = Number(amountStr);
  if (Number.isNaN(num) || num === 0) return "0";
  return num.toLocaleString();
}

function statusBadge(status: SerializedSettlementPreview["status"]): React.ReactNode {
  const styles: Record<string, string> = {
    insert: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    skip: "bg-gray-100 text-gray-600",
    invalid: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    insert: "新規",
    update: "更新",
    skip: "スキップ",
    invalid: "エラー",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function SettlementImportClient({ importedYears }: Props) {
  const [step, setStep] = useState<Step>("select");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [previews, setPreviews] = useState<SerializedSettlementPreview[]>([]);
  const [summary, setSummary] = useState<SerializedPreviewSummary | null>(null);
  const [fiscalYear, setFiscalYear] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportSettlementResult | null>(null);

  const handleFetch = async () => {
    if (!selectedYear) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const result: FetchSettlementPreviewResult = await fetchSettlementPreview(selectedYear);

      if (!result.ok) {
        setErrorMessage(result.error ?? "データの取得に失敗しました");
        return;
      }

      setPreviews(result.previews ?? []);
      setSummary(result.summary ?? null);
      setFiscalYear(result.fiscalYear ?? null);
      setStep("preview");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedYear) return;
    setImporting(true);
    setErrorMessage(null);

    try {
      const result = await importSettlementData(selectedYear);
      setImportResult(result);
      setStep("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "インポートに失敗しました");
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setStep("select");
    setSelectedYear("");
    setPreviews([]);
    setSummary(null);
    setFiscalYear(null);
    setErrorMessage(null);
    setImportResult(null);
  };

  const _hasErrors = summary ? summary.invalidCount > 0 : false;
  const hasImportable = summary ? summary.insertCount + summary.updateCount > 0 : false;

  return (
    <div className="space-y-6">
      {/* Step 1: 年度選択 */}
      {step === "select" && (
        <Card>
          <CardHeader>
            <CardTitle>年度を選択</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="w-64">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="年度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {FISCAL_YEAR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.code} value={opt.code}>
                        {opt.label}
                        {importedYears.includes(opt.fiscalYear) && " (取込済)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleFetch} disabled={!selectedYear || loading}>
                {loading ? "取得中..." : "データを取得"}
              </Button>
            </div>

            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4 text-red-800 text-sm">{errorMessage}</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: プレビュー */}
      {step === "preview" && summary && (
        <Card>
          <CardHeader>
            <CardTitle>{fiscalYear}年度 決算データプレビュー</CardTitle>
          </CardHeader>
          <CardContent>
            {/* サマリー */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-xs text-muted-foreground">総件数</div>
              </div>
              <div className="rounded-md bg-green-50 p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{summary.insertCount}</div>
                <div className="text-xs text-muted-foreground">新規</div>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{summary.updateCount}</div>
                <div className="text-xs text-muted-foreground">更新</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <div className="text-2xl font-bold text-gray-500">{summary.skipCount}</div>
                <div className="text-xs text-muted-foreground">スキップ</div>
              </div>
              <div className="rounded-md bg-red-50 p-3 text-center">
                <div className="text-2xl font-bold text-red-700">{summary.invalidCount}</div>
                <div className="text-xs text-muted-foreground">エラー</div>
              </div>
            </div>

            {/* エラー一覧 */}
            {summary.errors.length > 0 && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  エラー ({summary.errors.length}件)
                </h4>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {summary.errors.map((err, i) => (
                    <li key={`err-${i}-${err.path}`}>
                      [{err.path}] {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 警告一覧 */}
            {summary.warnings.length > 0 && (
              <div className="mb-4 rounded-md bg-yellow-50 p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  警告 ({summary.warnings.length}件)
                </h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1 max-h-40 overflow-y-auto">
                  {summary.warnings.map((w, i) => (
                    <li key={`warn-${i}-${w.path}`}>
                      [{w.path}] {w.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* データテーブル */}
            <div className="rounded-md border overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-background">ステータス</TableHead>
                    <TableHead className="sticky top-0 bg-background">団体コード</TableHead>
                    <TableHead className="sticky top-0 bg-background">自治体名</TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">
                      歳入合計 (千円)
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">
                      歳出合計 (千円)
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background text-right">人口</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previews.map((p) => (
                    <TableRow
                      key={p.municipalityCode}
                      className={
                        p.status === "invalid"
                          ? "bg-red-50"
                          : p.warnings.length > 0
                            ? "bg-yellow-50"
                            : ""
                      }
                    >
                      <TableCell>{statusBadge(p.status)}</TableCell>
                      <TableCell className="font-mono text-sm">{p.municipalityCode}</TableCell>
                      <TableCell>{p.municipalityName}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatAmount(p.revTotal)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatAmount(p.expPurposeTotal)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {p.population.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={handleReset}>
                戻る
              </Button>
              <Button onClick={handleImport} disabled={!hasImportable || importing}>
                {importing
                  ? "インポート中..."
                  : `インポート実行 (${summary.insertCount + summary.updateCount}件)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: 結果 */}
      {step === "result" && importResult && (
        <Card>
          <CardHeader>
            <CardTitle>インポート結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`rounded-md p-4 ${importResult.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              <p className="font-medium">{importResult.message}</p>
              {importResult.errors && importResult.errors.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm">
                  {importResult.errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-4">
              <div className="rounded-md bg-gray-50 p-3 text-center min-w-24">
                <div className="text-xl font-bold">{importResult.savedCount}</div>
                <div className="text-xs text-muted-foreground">保存件数</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3 text-center min-w-24">
                <div className="text-xl font-bold">{importResult.skippedCount}</div>
                <div className="text-xs text-muted-foreground">スキップ</div>
              </div>
            </div>
            <Button onClick={handleReset}>別の年度をインポート</Button>
          </CardContent>
        </Card>
      )}

      {/* エラーメッセージ（プレビュー/結果画面で表示） */}
      {step !== "select" && errorMessage && (
        <div className="rounded-md bg-red-50 p-4 text-red-800 text-sm">{errorMessage}</div>
      )}
    </div>
  );
}
