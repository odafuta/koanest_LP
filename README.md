# Koanest Website

自然との共生をテーマにしたウェブサイト

## プロジェクトコンセプト

### テーマ: 「自然との共生」
- 海、森、そして近未来の穏やかな社会など、「自然」を核としたテーマ
- サイトを訪れたユーザーが、心の穏やかさや、広大な自然への畏怖を感じられるような体験を提供

### 表現方法: 「ワイドな情景と没入感」
- グラフィックとアニメーションを多用し、表現力豊かなビジュアルを追求
- 広大な風景をワイドに映し出すズームアウトの手法で、開放感とスケール感を演出

## 技術スタック

### フロントエンド
- **React** ^19.1.0 - モダンなUIライブラリ
- **Vite** ^6.3.5 - 高速ビルドツール
- **Tailwind CSS** ^4.1.7 - ユーティリティファーストCSS
- **React Router DOM** ^7.6.1 - SPAルーティング
- **Framer Motion** ^12.15.0 - スムーズなアニメーション

### UIコンポーネント
- **Radix UI** - アクセシブルなプリミティブコンポーネント
- **Lucide React** ^0.510.0 - アイコンライブラリ
- **class-variance-authority** ^0.7.1 - バリアント管理

### フォーム・バリデーション
- **React Hook Form** ^7.56.3 - パフォーマンス重視のフォーム管理
- **Zod** ^3.24.4 - TypeScript-firstスキーマ検証

### その他
- **date-fns** ^4.1.0 - 日付操作ライブラリ
- **Embla Carousel** ^8.6.0 - カルーセルコンポーネント
- **Recharts** ^2.15.3 - チャートライブラリ

### 開発・ビルドツール
- **ESLint** ^9.25.0 - コード品質管理
- **pnpm** 10.4.1 - 高速パッケージマネージャー
- **GitHub Actions** - CI/CD (自動ビルド・デプロイ)

## プロジェクト構造

```
src/
├── components/    # 再利用可能なUIコンポーネント
│   └── ui/        # shadcn/ui ベースのUIプリミティブ
├── hooks/         # カスタムReactフック
├── lib/           # ユーティリティ関数
├── assets/        # 静的アセット（画像、アイコンなど）
├── App.jsx        # メインアプリケーションコンポーネント
├── App.css        # グローバルスタイル
└── main.jsx       # エントリーポイント

public/
└── vite.svg       # Viteロゴ（faviconとして使用）

.github/
└── workflows/
    └── deploy.yml # GitHub Actions CI/CD設定

# 環境変数ファイル
.env.production    # 本番環境用設定
.env.development   # 開発環境用設定
.env.preview       # プレビュー環境用設定
```

## 開発・デプロイフロー

### ブランチ構成
- `main`: 本番環境（自動デプロイ）
- `develop`: 開発環境（自動デプロイ）
- `feature/*`: 機能開発用ブランチ

### 開発の流れ

1. **機能開発**
   ```bash
   git checkout -b feature/new-feature
   # 開発作業...
   git push origin feature/new-feature
   ```

2. **プルリクエストの作成**
   GitHub上で「feature → develop」のPull Request を作成
   GitHubでプルリクエストを作成すると、自動的にプレビュー環境にデプロイされ、PRコメントにプレビューURLが表示されます。

3. **開発環境への統合**
   ```bash
   git checkout develop
   git merge feature/new-feature
   git push origin develop
   # → 自動で開発プレビュー環境にデプロイ
   ```

4. **本番リリース**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # → 自動で本番環境にデプロイ
   ```

### 環境URL
- **本番環境**: `https://[username].github.io/koanest_LP/`
- **開発プレビュー環境**: developブランチ push時にGitHub Actionsが生成
- **プルリクエストプレビュー環境**: PR作成時にGitHub Actionsが生成（PRコメントに表示）

### 環境別の設定
各環境で異なる設定が`.env`ファイルで管理されています：

| 項目 | 本番環境 | 開発/PR環境 |
|------|----------|-------------|
| **ベースパス** | `/koanest_LP/` | `/` |
| **環境ラベル** | `PRODUCTION` | `DEVELOPMENT` / `PREVIEW` |
| **robots.txt** | `Allow: /` | `Disallow: /` |
| **SEO** | インデックス許可 | インデックス禁止 |

## 環境変数設定

### 環境変数ファイルの構成

このプロジェクトでは、環境別に以下の`.env`ファイルが設定されています：

```dotenv
# .env.production（本番環境用）
VITE_BASE_PATH=/koanest_LP/
VITE_ENV_LABEL=PRODUCTION

# .env.development（開発環境用）
VITE_BASE_PATH=/
VITE_ENV_LABEL=DEVELOPMENT

# .env.preview（プレビュー環境用）
VITE_BASE_PATH=/
VITE_ENV_LABEL=PREVIEW
```

### 環境変数の役割

- **`VITE_BASE_PATH`**: アプリケーションのベースURL
  - 本番環境: `/koanest_LP/`（GitHub Pagesのサブディレクトリ）
  - 開発/PR環境: `/`（ルートパス）

- **`VITE_ENV_LABEL`**: 環境識別ラベル
  - 開発環境バナー表示用
  - デバッグ情報の表示制御

### Viteの環境モード

GitHub Actionsでは以下のようにmodeを指定してビルドします：

```bash
# 本番環境ビルド
pnpm run build:prod    # → vite build --mode production → .env.production

# 開発環境ビルド  
pnpm run build:dev     # → vite build --mode development → .env.development

# プレビュー環境ビルド
pnpm run build:preview # → vite build --mode preview → .env.preview
```

## セットアップ手順

### 0. 前提条件とpnpmのインストール

#### Node.jsのインストール
```bash
# Node.js 20以上が必要です
node --version  # v20.0.0以上であることを確認
```

Node.jsがインストールされていない場合：
- **公式サイト**: https://nodejs.org/ からLTS版をダウンロード
- **nvm使用**: `nvm install 20 && nvm use 20`

#### pnpmのインストール
```bash
# npmを使用してpnpmをグローバルインストール
npm install -g pnpm

# インストール確認
pnpm --version  # 10.4.1であることを確認（このプロジェクトの推奨バージョン）

# または、公式推奨のインストール方法
curl -fsSL https://get.pnpm.io/install.sh | sh
# Windows PowerShellの場合
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**pnpm使用の利点：**
- **高速**: npmより3倍高速なインストール
- **省スペース**: 重複パッケージの共有でディスク使用量削減
- **厳密**: より正確な依存関係管理

### 1. プロジェクトのクローン

```bash
# GitHubリポジトリをクローン
git clone https://github.com/odafuta/koanest-website.git
cd koanest-website

# または、SSH を使用する場合
git clone git@github.com:odafuta/koanest-website.git
cd koanest-website
```

### 2. 環境変数ファイルの確認

プロジェクトルートに以下の環境変数ファイルが存在することを確認してください：

```bash
# Windows PowerShell の場合
echo VITE_BASE_PATH=/koanest_LP/ > .env.production
echo VITE_ENV_LABEL=PRODUCTION >> .env.production

echo VITE_BASE_PATH=/ > .env.development  
echo VITE_ENV_LABEL=DEVELOPMENT >> .env.development

echo VITE_BASE_PATH=/ > .env.preview
echo VITE_ENV_LABEL=PREVIEW >> .env.preview

# Linux / macOS の場合
echo "VITE_BASE_PATH=/koanest_LP/" > .env.production
echo "VITE_ENV_LABEL=PRODUCTION" >> .env.production

echo "VITE_BASE_PATH=/" > .env.development
echo "VITE_ENV_LABEL=DEVELOPMENT" >> .env.development

echo "VITE_BASE_PATH=/" > .env.preview
echo "VITE_ENV_LABEL=PREVIEW" >> .env.preview
```

**ファイルが既に存在する場合は、この手順をスキップしてください。**

### 3. 依存関係のインストール

```bash
# 初回セットアップ・チームメンバーとの環境統一（推奨）
pnpm install --frozen-lockfile

# 開発中に新しいパッケージを追加・更新する場合のみ
# pnpm add [パッケージ名]     # 新しいパッケージを追加
# pnpm update [パッケージ名]  # 既存パッケージを更新
# pnpm install              # package.jsonを手動編集した後の同期
```

**コマンドの関係性：**
- `pnpm install --frozen-lockfile`: **初回セットアップ用**（`pnpm install`の機能を含む + 厳密性）
- `pnpm install`: **開発中のパッケージ管理用**（`pnpm-lock.yaml`を必要に応じて更新）

**使い分けの例：**
```bash
# ✅ 初回セットアップ・他の開発者と環境を合わせたい場合
pnpm install --frozen-lockfile  # これだけで完了（pnpm installは不要）

# ✅ 新しいライブラリを追加する場合
pnpm add react-router-dom
# この時点で pnpm-lock.yaml が自動更新される

# ✅ package.json を手動編集した後
pnpm install  # pnpm-lock.yaml を更新

# ✅ 依存関係を最新版に更新したい場合
pnpm update
```

**なぜ初回セットアップで --frozen-lockfile を使用するのか：**
- **包含性**: `pnpm install`の全機能を含む（依存関係インストール、node_modules生成）
- **再現性**: 他の開発者と全く同じバージョンの依存関係をインストール
- **安全性**: 意図しないパッケージの更新を防ぐ
- **高速**: ロックファイルを更新しないため、インストールが高速
- **CI/CD環境**: GitHub Actionsでも同じオプションを使用

### 4. ローカル開発
```bash
# 開発サーバー起動 (ホットリロード)
pnpm dev

# 本番用静的ビルドの生成とローカルプレビュー
pnpm build:prod    # 本番環境向けに最適化されたビルドを生成
pnpm preview       # 生成済みのビルド成果物 (dist/) をローカルサーバーで確認

# (オプション) 環境モード別の静的ビルド
pnpm build:dev     # development mode のビルド生成 (通常はCI用)
pnpm build:preview # preview mode のビルド生成 (PR環境と同等の確認用)

# コード品質チェック
pnpm lint
```

**コマンドの詳細説明：**

#### 開発時に使用するコマンド
- **`pnpm dev`**: 開発サーバーを起動（通常は http://localhost:5173）
  - ホットリロード機能付き（ファイル変更時に自動更新）
  - ファイルはメモリ上で処理（`dist/`フォルダは作成されない）
  - 開発中のリアルタイム確認用

#### デプロイ前の確認用コマンド
- **`pnpm build:prod`**: 本番環境用の静的ファイルを生成
  - `dist/`フォルダに最適化されたHTML/CSS/JSファイルを出力
  - GitHub Actionsが実際に使用するのと同じビルド
  - ベースパス: `/koanest_LP/`（本番環境と同じ）

- **`pnpm preview`**: ビルド済みファイルをローカルでプレビュー
  - `dist/`フォルダの内容をローカルサーバーで表示
  - 本番環境と同じ状態をローカルで確認可能
  - **重要**: `pnpm build:prod`実行後に使用

#### CI/CD専用ビルドコマンド
- **`pnpm build:dev`**: 開発プレビュー環境用（ベースパス: `/`）
- **`pnpm build:preview`**: PRプレビュー環境用（ベースパス: `/`）

**使い分けの例：**
```bash
# 日常的な開発作業
pnpm dev                    # ← 最もよく使用

# デプロイ前の最終確認
pnpm build:prod && pnpm preview  # ← 本番環境と同じ状態で確認

# 問題が発生した場合のデバッグ
pnpm lint                   # コード品質チェック
```

### 5. GitHub Pagesの設定（重要）

**⚠️ この設定は必須です！設定しないとサイトが公開されません。**

1. GitHubリポジトリページで **Settings** タブをクリック
2. 左サイドバーの **Pages** をクリック
3. **Source** セクションで **"GitHub Actions"** を選択
4. **Save** をクリック

#### なぜこの設定が必要なのか？

| 設定状況 | 結果 | 説明 |
|---------|------|------|
| **設定済み** | ✅ サイトが公開される | GitHub ActionsからGitHub Pagesへの自動デプロイが有効 |
| **未設定** | ❌ サイトが公開されない | ビルドは成功してもGitHub Pagesが認識しない |

#### 設定後の確認方法

設定が完了すると、以下のURLでサイトにアクセスできるようになります：

```
本番環境: https://odafuta.github.io/koanest_LP/
```

**注意**: 初回デプロイ後、サイトが利用可能になるまで数分かかる場合があります。

### 6. 最初のデプロイ（本番環境）
```bash
# 現在のコードを本番環境にデプロイ
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main
```

### 7. 開発環境の設定（オプション）
```bash
# 開発用ブランチを作成
git checkout -b develop
git push origin develop
```

## 開発ガイドライン

### コンポーネント設計
- `src/components/`に再利用可能なコンポーネントを配置
- `src/components/ui/`にshadcn/uiベースのプリミティブコンポーネント
- Radix UIをベースとしたアクセシブルなコンポーネント作成
- Tailwind CSSを使用したレスポンシブデザイン

### アニメーション
- Framer Motionを使用したスムーズなアニメーション実装
- 自然の動きを意識したイージング設定

### ビルド設定
- 環境変数`VITE_BASE_PATH`でデプロイパスを動的設定（`.env`ファイルで管理）
- Vite設定で`@`エイリアスを使用（`@/components`等）
- robots.txtも環境別に自動生成（SEO対策）
- Viteの`--mode`オプションで環境別の`.env`ファイルを読み込み
