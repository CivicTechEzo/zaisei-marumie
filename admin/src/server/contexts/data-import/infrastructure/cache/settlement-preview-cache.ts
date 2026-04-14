/**
 * プレビュー結果の一時キャッシュ
 *
 * プレビュー → インポートの間、取得済みデータを保持する。
 * Module-level Map + TTL による簡易実装。
 * 管理画面の少数ユーザー向けで、BigIntをそのまま保持できる。
 */

import type { PreviewSettlementResult } from "@/server/contexts/data-import/domain/models/settlement-preview";

interface CacheEntry {
  result: PreviewSettlementResult;
  expiresAt: number;
}

/** キャッシュ保持時間: 10分 */
const TTL_MS = 10 * 60 * 1000;

const cache = new Map<string, CacheEntry>();

export function setPreviewCache(yearCode: string, result: PreviewSettlementResult): void {
  // 古いエントリをクリーンアップ
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt < now) {
      cache.delete(key);
    }
  }

  cache.set(yearCode, {
    result,
    expiresAt: now + TTL_MS,
  });
}

export function getPreviewCache(yearCode: string): PreviewSettlementResult | null {
  const entry = cache.get(yearCode);
  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    cache.delete(yearCode);
    return null;
  }

  return entry.result;
}

export function clearPreviewCache(yearCode: string): void {
  cache.delete(yearCode);
}
