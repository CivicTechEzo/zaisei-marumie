# 財政まる見え

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Biome](https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)

> 北海道の自治体財政をまる見えにするオープンソースダッシュボード

北海道内の自治体（道を含む）の歳入・歳出データを可視化し、住民が自分たちの自治体の財政状況を直視できるようにするためのWebアプリケーションです。財政の現実を「見える化」することで、住民サービスの縮小についての理解や、現状維持がいかに難しいかという認識を広めることを目指しています。

[team-mirai/marumie](https://github.com/team-mirai/marumie)（みらいまる見え政治資金）をベースに、[CivicTechEzo](https://github.com/CivicTechEzo) が自治体財政の文脈で開発しています。

## プロジェクト構成

このプロジェクトは以下のディレクトリ構成で構築されています：

### ディレクトリ構造

```
zaisei-marumie/
├── webapp/           # フロントエンド（住民向け）
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── client/        # クライアントサイドコンポーネント
│   │   ├── server/contexts/ # Bounded Context ベース構成
│   │   │   └── public-finance/  # 財政データの公開・可視化
│   │   └── types/         # 型定義
│   ├── tests/             # テストファイル
│   └── package.json
├── admin/            # 管理画面
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── client/        # クライアントサイドコンポーネント
│   │   ├── server/contexts/ # Bounded Context ベース構成
│   │   │   ├── auth/      # 認証関連処理
│   │   │   ├── data-import/  # 財政データ取り込み
│   │   │   └── shared/    # コンテキスト横断共有
│   │   ├── types/         # 型定義
│   │   └── middleware.ts
│   ├── tests/             # テストファイル
│   └── package.json
├── shared/           # 共通モデル・型定義・ユーティリティ
│   ├── models/       # 共通データモデル
│   └── utils/        # 共通ユーティリティ関数
├── data/             # サンプルデータ
├── supabase/         # Supabaseローカル開発環境設定
├── prisma/           # データベーススキーマ・マイグレーション
└── docs/             # 設計ドキュメント
```

### 各ディレクトリの役割

- **webapp/**: 住民向けのフロントエンドアプリケーション（自治体財政データの可視化）
- **admin/**: 管理者向けの管理画面（データ登録・管理機能）
- **shared/**: webapp と admin で共通して使用するモデル、型定義、ユーティリティ関数
- **data/**: サンプルデータファイル
- **supabase/**: Supabaseローカル開発環境の設定ファイルとテンプレート
- **prisma/**: データベーススキーマ定義、マイグレーションファイル、シードデータ
- **docs/**: プロジェクトの設計ドキュメント

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Prisma ORM, Supabase
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts, ApexCharts, Nivo
- **Database**: PostgreSQL (via Supabase)
- **Development**: pnpm, Biome
- **Testing**: Jest

## ローカル開発手順

ローカル開発環境のセットアップ手順は [開発環境セットアップガイド](docs/getting-started.md) を参照してください。

## 元プロジェクト

このプロジェクトは [team-mirai/marumie](https://github.com/team-mirai/marumie)（みらいまる見え政治資金）をベースにしています。政治資金の可視化という優れたアーキテクチャを、自治体財政の文脈に適用しています。

## ライセンス

このプロジェクトは [GNU Affero General Public License v3.0](LICENSE) の下でライセンスされています。

## ライセンス表示

このソフトウェアを使用する場合は、適切なライセンス表示を行ってください。詳細は [LICENSE](LICENSE) ファイルをご確認ください。
