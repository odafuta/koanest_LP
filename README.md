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
- **React** 19.1.0 - モダンなUIライブラリ
- **Vite** 6.3.5 - 高速ビルドツール
- **Tailwind CSS** 4.1.7 - ユーティリティファーストCSS
- **React Router DOM** 7.6.1 - SPAルーティング
- **Framer Motion** - スムーズなアニメーション

### UIコンポーネント
- **Radix UI** - アクセシブルなプリミティブコンポーネント
- **Lucide React** - アイコンライブラリ
- **class-variance-authority** - バリアント管理

### フォーム・バリデーション
- **React Hook Form** - パフォーマンス重視のフォーム管理
- **Zod** - TypeScript-firstスキーマ検証

### その他
- **date-fns** - 日付操作ライブラリ
- **Embla Carousel** - カルーセルコンポーネント
- **Recharts** - チャートライブラリ

### 開発・ビルドツール
- **ESLint** - コード品質管理
- **pnpm** - 高速パッケージマネージャー
- **GitHub Actions** - CI/CD (自動ビルド・デプロイ)

## プロジェクト構造

```
src/
├── components/    # 再利用可能なUIコンポーネント
├── hooks/         # カスタムReactフック
├── lib/           # ユーティリティ関数
├── assets/        # 静的アセット（画像、アイコンなど）
├── App.jsx        # メインアプリケーションコンポーネント
├── App.css        # グローバルスタイル
├── main.jsx       # エントリーポイント
└── index.css      # Tailwindベーススタイル
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
- **開発プレビュー環境**: developブランチへのpush時に生成されるプレビューURL（GitHub ActionsのEnvironment URL参照）
- **プルリクエストプレビュー環境**: プルリクエスト作成時に生成されるプレビューURL（PRコメント参照）

## セットアップ手順

### 0. 環境変数ファイルの準備
プロジェクトルートに以下のファイルを作成してください。

```dotenv
# .env.production
VITE_BASE_PATH=/koanest_LP/
VITE_ENV_LABEL=PRODUCTION

# .env.development
VITE_BASE_PATH=/
VITE_ENV_LABEL=DEVELOPMENT

# .env.preview
VITE_BASE_PATH=/
VITE_ENV_LABEL=PREVIEW
```

Viteは `--mode` フラグに応じて自動的にこれらを読み込みます。

### 1. 依存関係のインストール
```bash
# pnpmを使用（推奨）
pnpm install

# または npm
npm install
```

### 2. ローカル開発
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

### 3. GitHub Pagesの設定
1. GitHub > Settings > Pages
2. Source: "GitHub Actions" を選択

### 4. 最初のデプロイ（本番環境）
```bash
# 現在のコードを本番環境にデプロイ
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main
```

### 5. 開発環境の設定（オプション）
```bash
# 開発用ブランチを作成
git checkout -b develop
git push origin develop
```

### 6. 開発環境を非公開にしたい場合
以下のいずれかを選択：
- `.github/workflows/deploy.yml`の`deploy-development`ジョブを削除
- Vercel/Netlifyのパスワード保護機能を使用
- プライベートリポジトリで開発環境を管理

## 開発ガイドライン

### コンポーネント設計
- `src/components/`に再利用可能なコンポーネントを配置
- Radix UIをベースとしたアクセシブルなコンポーネント作成
- Tailwind CSSを使用したレスポンシブデザイン

### アニメーション
- Framer Motionを使用したスムーズなアニメーション実装
- 自然の動きを意識したイージング設定

### ビルド設定
- 環境変数`VITE_BASE_PATH`でデプロイパスを動的設定
- Vite設定で`@`エイリアスを使用（`@/components`等）
