# Claude Code 設定

## アプリケーション概要

北海道内の自治体（道を含む）の歳入・歳出データを可視化し、住民が財政状況を直視できるようにするためのWebアプリケーションです。[team-mirai/marumie](https://github.com/team-mirai/marumie)（政治資金可視化アプリ）をベースに、自治体財政の文脈で開発しています。

- webapp（公開用フロントエンド）: 住民向けの財政データ可視化ダッシュボード
- admin（管理画面）: 財政データの取り込み・管理
- 技術スタック: Next.js 15 (App Router) / Prisma / Supabase (PostgreSQL) / Vercel / pnpm
- 詳細は [README.md](README.md) を参照

## コード構成

webapp / admin ともに Bounded Context パターンとレイヤードアーキテクチャに基づく設計を採用しています。

```
{webapp,admin}/src/
├── app/          # App Router に基づくルーティング、API エンドポイント
├── client/
│   ├── components/  # Reactコンポーネント
│   └── lib/         # クライアントで動作するヘルパーなど
├── server/contexts/
│   └── {コンテキスト名}/  # Bounded Context ごとにディレクトリを分割
└── types/        # 型定義
```

### Bounded Context 一覧

| アプリ | コンテキスト | 責務 |
|--------|-------------|------|
| webapp | **public-finance** | 自治体財政データの公開・可視化 |
| admin | **data-import** | 財政データインポート、取引データプレビュー |
| admin | **auth** | 認証・認可、ユーザー管理 |
| 共通 | **shared** | コンテキスト横断で共有（prisma client、汎用リポジトリなど） |

### 各コンテキストの構造

```
contexts/{コンテキスト名}/
├── presentation/
│   ├── loaders/     # サーバーサイドでのデータ取得処理
│   └── actions/     # サーバーアクション（"use server"）による副作用処理
├── application/
│   └── usecases/    # loaderやactionから呼び出されるトップレベル関数
├── domain/
│   ├── services/    # ドメインサービス（複数エンティティをまたぐ処理）
│   ├── models/      # ドメインモデル
│   └── repositories/  # リポジトリインターフェース
└── infrastructure/
    └── repositories/  # データベースアクセス層（リポジトリ実装）
```

詳細は [docs/backend-architecture-guide.md](docs/backend-architecture-guide.md) を参照すること。

## 実装ルール

### Next アプリケーション

- 動的に更新する必要がある画面（チャットなど）以外は、データ取得はなるべくサーバーコンポーネントに寄せる
- client 側で動作する必然性（状態管理・ブラウザ API 利用・重い UI ライブラリ等）がない限り "use client" は利用しない
- サーバーコンポーネントからのデータ取得は、原則 loaders などに切り出したサーバー処理を使い責務を分離する
- サーバー側で動作することを期待する処理には import "server-only" を書き、誤ってクライアントから参照されないようにする
- サーバーアクション（"use server"処理）は、データ更新やファイルアップロードなど副作用を伴う操作のためだけに使い、あわせて revalidatePath や revalidateTag などの再検証処理までを 1 セットで行う
- クライアント側でのデータ取得は例外として、リアルタイム通信・高頻度ポーリング・ユーザー操作に即応する検索・オフライン最適化（React Query など）に限って許容する

### import

- TypeScript の import は `@/` から始まる絶対パスを使用する（相対パス禁止）

## wtp (git worktree) の利用

並行開発が必要な場合は wtp を使う。詳細は [docs/wtp-guide.md](docs/wtp-guide.md) を参照。

## GitHub操作ルール

PRを作成する際は [.claude/commands/pr.md](.claude/commands/pr.md) の手順に従うこと。

## 設計作業ルール

設計ドキュメントを作成する場合は [.claude/commands/plan.md](.claude/commands/plan.md) の手順に従うこと。

## 元プロジェクト（政治資金可視化アプリ）のコード参照

本プロジェクトは [team-mirai/marumie](https://github.com/team-mirai/marumie)（政治資金可視化アプリ）をベースにしている。Prismaスキーマは自治体財政用に書き換え済みだが、旧モデル（Transaction, Counterpart, Donor等）を参照するコードがまだ残っており、typecheckエラーが発生する状態にある。

各機能の実装・書き換え時に、元プロジェクトのコードがパターンやロジックの参考になる場合がある。旧コードが完全に残っている最後のコミットは `cef44c72` なので、以下のコマンドで参照できる:

```bash
# 特定ファイルの内容を見る
git show cef44c72:<ファイルパス>

# 例: 旧Transactionリポジトリを参照
git show cef44c72:webapp/src/server/contexts/public-finance/infrastructure/repositories/prisma-transaction.repository.ts
```

### git push 時の注意

旧コードの型エラーにより pre-push フックの typecheck が失敗するため、当面は `git push --no-verify` でプッシュする。旧コードの書き換え・削除が完了し typecheck が通るようになったら、この記載を削除すること。

## バックエンドアーキテクチャガイド

webapp / admin のバックエンド実装に関する詳細なルールは [docs/backend-architecture-guide.md](docs/backend-architecture-guide.md) を参照すること。

## admin UI コンポーネント

admin で UI コンポーネントを使用する際は [docs/admin-ui-guidelines.md](docs/admin-ui-guidelines.md) を参照すること。
