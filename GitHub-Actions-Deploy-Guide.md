# GitHub Actions デプロイメント完全ガイド

## 目次
1. [デプロイ方式の比較](#デプロイ方式の比較)
2. [ブランチ戦略とワークフロー](#ブランチ戦略とワークフロー)
3. [GitHub Actions設定](#github-actions設定)
4. [SEO対策と開発環境管理](#seo対策と開発環境管理)
5. [実装手順](#実装手順)
6. [トラブルシューティング](#トラブルシューティング)
7. [GitHub Actions 技術詳細解説](#github-actions-技術詳細解説)

---

## GitHub Actions方式（推奨）によるデプロイ方式

### 自動化されるワークフロー
1. `main`または`develop`にpushする
2. GitHub Actionsが自動的に：
   - **コードをビルド**: ReactやViteのソースコードを本番用のHTML/CSS/JSファイルに変換
   - **テストを実行**: 自動テスト（単体テスト、統合テスト）でバグがないか確認
   - **環境別にデプロイ**: 
     - `main` → 本番環境（公式URL）
     - `develop` → 開発プレビュー環境（preview-dev URL）
     - PR → プルリクエストプレビュー環境（preview-pr URL）

**ビルドとは？**
- 開発中のコード（JSX、TypeScript、SCSS等）を、ブラウザが理解できる形（HTML、CSS、JS）に変換する処理
- ファイルサイズの最適化、不要なコードの削除も含む

**テストとは？**
- コードが正しく動作するかを自動で確認する処理
- 例：「ボタンを押したら正しい画面が表示されるか」「計算結果が正しいか」

### Vercelとの関係

**Vercelは今回のガイドでは使用しません**が、以下のような違いがあります：

| 項目 | GitHub Pages | Vercel |
|------|-------------|--------|
| 費用 | 無料 | 無料プランあり |
| 設定 | GitHub Actions必要 | 自動デプロイ |
| 独自ドメイン | 設定が複雑 | 簡単 |
| サーバーサイド | 静的サイトのみ | API機能も使用可能 |

**Vercelを使う場合の追加ステップ：**
```bash
# 前提: pnpmがインストール済みであること
# Vercelを使う場合（このガイドでは不要）
pnpm install -g vercel
vercel login
vercel --prod
```

---

## デプロイ方法の統一化とベストプラクティス

### 2025年推奨アプローチ：actions/deploy-pages統一

#### すべての環境で公式APIを使用

```yaml
# 本番環境（production）
uses: actions/deploy-pages@v4  # GitHub Pages公式API

# 開発環境（develop preview）
uses: actions/deploy-pages@v4  # GitHub Pages公式API + preview: true
with:
  preview: true

# プルリクエスト環境（PR preview）
uses: actions/deploy-pages@v4  # GitHub Pages公式API + preview: true
with:
  preview: true
```

### 統一化のメリット

#### 1. **セキュリティの向上**

**すべての環境で同一の安全性：**
- GitHub Pages公式APIを使用
- OIDC（OpenID Connect）認証
- 自動的なセキュリティチェック
- 権限の最小化（pages + id-token のみ）

#### 2. **GitHub Pagesの新機能活用**

**2023年末にリリースされた機能：**
- 1リポジトリで複数環境の同時運用
- Production（本番）+ Preview（プレビュー）環境の併存
- 自動的なプレビューURL生成

```
本番環境：https://username.github.io/koanest_LP/
開発環境：https://pr-dev--username-koanest-website.preview.github.dev/
PR環境：  https://pr-42--username-koanest-website.preview.github.dev/
```

#### 3. **運用の簡素化**

**一元管理による利点：**
- 同じアーティファクト（build結果）を全環境で使用
- 統一されたデプロイログ
- 一貫したロールバック機能
- 環境間の設定差分を最小化

#### 4. **従来の問題を解決**

**旧方式の課題：**
- Git force-pushによる履歴破壊 → 解決：公式APIは履歴を保持
- 競合状態（race condition） → 解決：GitHub側で自動調整
- 手動のブランチ切り替え → 解決：自動的な環境振り分け
- セキュリティリスク → 解決：OIDC認証

### 環境別の設定比較

| 項目 | 本番環境 | 開発環境 | PR環境 |
|------|----------|----------|---------|
| **トリガー** | main push | develop push | pull_request |
| **URL** | 公式ドメイン | preview subdomain | preview subdomain |
| **ベースパス** | /koanest_LP/ | / | / |
| **robots.txt** | Allow | Disallow | Disallow |
| **環境ラベル** | PRODUCTION | DEVELOPMENT | PREVIEW |
| **承認フロー** | 可能 | 不要 | 不要 |
| **保持期間** | 永続 | 最新10件 | PR close時削除 |

### 従来のハイブリッド方式を避ける理由

**問題のあった構成：**
```yaml
# ❌ 非推奨：本番と開発で異なる方式
deploy-production:
  uses: actions/deploy-pages@v4  # 公式API

deploy-development:
  run: git push origin gh-pages-dev --force  # 手動Git操作
```

**課題：**
1. **一貫性の欠如**: 異なるデプロイ方式による運用の複雑化
2. **セキュリティ格差**: 本番は安全、開発は脆弱性リスク
3. **機能差**: プレビューURL自動生成などの恩恵を受けられない
4. **将来性**: GitHub Pagesの新機能に追従できない

---

## ブランチ戦略とワークフロー

### ブランチ構成
```
main (本番環境) → https://[username].github.io/koanest_LP/
├── develop (開発環境) → https://pr-dev--[username]-koanest-website.preview.github.dev/
├── feature/new-design (機能開発用)
├── feature/animation-fix (機能開発用)
└── hotfix/urgent-bug (緊急修正用)
```

### ブランチの役割

#### `main`ブランチ
- **役割**: 本番リリース（安定版のみ）
- **デプロイ**: 本番環境に自動デプロイ
- **確認**: 最終的な品質確認済み

#### `develop`ブランチ
- **役割**: 開発中の機能を統合する場所
- **用途**: 複数の`feature`をまとめてテスト
- **デプロイ**: 開発プレビュー環境に自動デプロイ
- **確認**: 全体の動作確認、統合テスト

#### `feature/*`ブランチ
- **役割**: 個別の機能開発
- **用途**: 1つの機能に集中して開発
- **デプロイ**: 通常はローカルでのみテスト
- **確認**: その機能だけの動作確認

### 実際の開発フロー

```bash
# 1. 新機能開発開始
git checkout develop
git checkout -b feature/rainbow-hover

# 2. 機能開発
# コード書く...
git add .
git commit -m "Add rainbow hover effect"
git push origin feature/rainbow-hover
# → PRをgithub上でしたら自動で開発プレビュー環境にデプロイ

# 3. 開発環境で統合テスト
git checkout develop
git merge feature/rainbow-hover
git push origin develop
# → 自動で開発プレビュー環境にデプロイ

# 4. 問題なければ本番リリース
git checkout main
git merge develop
git push origin main
# → 自動で本番環境にデプロイ
```

---

## GitHub Actions設定

### 1. ワークフローファイルの作成

#### ファイルパス
```
.github/workflows/deploy.yml
```

#### 完全なワークフロー設定（現在の実際の設定）

```yaml
# ワークフローの名前（GitHub Actionsの画面で表示される）
name: Deploy to GitHub Pages

# いつこのワークフローを実行するかの条件
on:
  push:  # コードがpushされたとき
    branches:
      - main      # mainブランチへのpush → 本番デプロイ
      - develop   # developブランチへのpush → 開発環境デプロイ
  pull_request:  # プルリクエストが作成されたとき
    branches:
      - main      # mainへのPR → プレビュー環境
      - develop   # developへのPR → プレビュー環境

# 並行実行の制御
concurrency:
  group: pages-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

# 実行するジョブ（作業）の定義
jobs:
  # 1つ目のジョブ：ビルド作業
  build:
    runs-on: ubuntu-latest  # Ubuntu環境で実行
    steps:  # このジョブで実行する手順
      # ステップ1: ソースコードをダウンロード
      - name: Checkout
        uses: actions/checkout@v4  # GitHubが提供する公式アクション

      # ステップ2: Node.jsの環境を準備
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'  # Node.js バージョン20を使用
          cache: 'npm'        # npm のキャッシュを有効化（高速化）

      # ステップ3: 依存関係（ライブラリ）をインストール
      - name: Install dependencies
        run: pnpm install --frozen-lockfile  # pnpm-lock.yamlに基づいて正確にインストール (npm でいう npm ci に相当 )

      # ステップ4: 開発環境用のrobots.txt作成
      - name: Create robots.txt for development
        if: github.ref == 'refs/heads/develop'  # developブランチの場合のみ実行
        run: |
          echo "User-agent: *" > public/robots.txt
          echo "Disallow: /" >> public/robots.txt
          echo "# 開発環境 - 検索エンジンにインデックスしない" >> public/robots.txt

      # ステップ5: プレビュー環境用のrobots.txt作成
      - name: Create robots.txt for pull requests
        if: github.event_name == 'pull_request'
        run: |
          echo "User-agent: *" > public/robots.txt
          echo "Disallow: /" >> public/robots.txt
          echo "# プレビュー環境 - 検索エンジンにインデックスしない" >> public/robots.txt

      # ステップ5: 本番環境用のrobots.txt作成
      - name: Create robots.txt for production
        if: github.ref == 'refs/heads/main'  # mainブランチの場合のみ実行
        run: |
          echo "User-agent: *" > public/robots.txt
          echo "Allow: /" >> public/robots.txt
          echo "Sitemap: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}/sitemap.xml" >> public/robots.txt

      - name: Build for production
        if: github.ref == 'refs/heads/main'
        run: pnpm run build:prod

      - name: Build for development
        if: github.ref == 'refs/heads/develop'
        run: pnpm run build:dev

      - name: Build for pull request
        if: github.event_name == 'pull_request'
        run: pnpm run build:preview

      - name: Upload build artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist  # ビルド結果が格納されるディレクトリ

  # 2つ目のジョブ：本番環境へのデプロイ
  deploy-production:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: build  # buildジョブの完了を待つ
    runs-on: ubuntu-latest
    environment:  # GitHub環境設定
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    permissions:  # このジョブに必要な権限
      pages: write    # GitHub Pagesへの書き込み権限
      id-token: write # 認証トークンの書き込み権限
    steps:
      # GitHub Pages公式のデプロイアクションを実行
      - name: Deploy to GitHub Pages (production)
        id: deployment
        uses: actions/deploy-pages@v4

  # 3つ目のジョブ：開発環境へのデプロイ
  deploy-development:
    # 実行条件：developブランチへのpushかつbuildジョブが成功した場合のみ
    if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: develop
      url: ${{ steps.deployment.outputs.page_url }}
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages (develop preview)
        id: deployment
        uses: actions/deploy-pages@v4
        with:
          preview: true

  # 4つ目のジョブ：プルリクエスト時のPR作成及びデプロイ
  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: pr-${{ github.event.pull_request.number }}
      url: ${{ steps.deployment.outputs.page_url }}
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy PR preview via GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        with:
          preview: true

      - name: Comment PR with Preview URL
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const deploymentUrl = '${{ steps.deployment.outputs.page_url }}';
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview ready: ${deploymentUrl}`
            })
```

### 2. Vite設定の更新

#### `vite.config.js`（現在の実際の設定）

```javascript
// 必要なモジュールをインポート
import { defineConfig } from 'vite'        // Viteの設定を定義するための関数
import react from '@vitejs/plugin-react'   // React用のViteプラグイン
import tailwindcss from '@tailwindcss/vite' // TailwindCSS用のViteプラグイン
import path from 'path'                     // ファイルパスを操作するためのNode.jsモジュール

// Viteの設定をエクスポート
// https://vite.dev/config/
export default defineConfig({
  // 使用するプラグインの配列
  plugins: [
    react(),      // JSXをJavaScriptに変換
    tailwindcss() // TailwindCSSを処理
  ],
  
  // モジュール解決の設定
  resolve: {
    alias: {
      // "@"を"./src"のエイリアスとして設定
      // import Button from "@/components/Button" のように書ける
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // 公開時のベースパス設定
  // 環境変数VITE_BASE_PATHがあればそれを使用、なければ'/'をデフォルト
  // GitHub Actionsで環境別に自動設定される
  base: process.env.VITE_BASE_PATH || '/',
})
```

### 3. package.json の更新（推奨設定）

```json
{
  "scripts": {
    // 開発サーバーを起動（ホットリロード付き）
    "dev": "vite",
    
    // 本番用ファイルをビルド（distフォルダに生成）
    "build": "vite build",
    
    // ESLintでコードの品質をチェック
    "lint": "eslint .",
    
    // ビルドしたファイルをローカルでプレビュー
    "preview": "vite preview",
    
    // 開発環境用のビルド（development mode）
    "build:dev": "vite build --mode development",
    
    // 本番環境用のビルド（production mode）
    "build:prod": "vite build --mode production",
    
    // プレビュー環境用のビルド（preview mode）
    "build:preview": "vite build --mode preview"
  }
}
```

---

## SEO対策と開発環境管理

### robots.txtの活用方法

#### robots.txtとは？
検索エンジン（Google、Bingなど）に対して「このサイトをインデックス（検索結果に表示）してもいいか」を指示するファイルです。

#### どこで活用されるのか？

**1. GitHub Actionsでの自動生成**
```yaml
# deploy.ymlで環境別にrobots.txtを自動生成
- name: Create robots.txt for development
  if: github.ref == 'refs/heads/develop'
  run: |
    echo "User-agent: *" > public/robots.txt        # publicフォルダに作成
    echo "Disallow: /" >> public/robots.txt         # 全てのページを検索対象外に
```

**2. ビルド時に自動的にdistフォルダにコピー**
- `public/robots.txt` → `dist/robots.txt` に自動コピー
- デプロイ時に `https://[username].github.io/koanest_LP/robots.txt` でアクセス可能になる

**3. 検索エンジンが自動的に読み込み**
- Google等が定期的に `https://yoursite.com/robots.txt` にアクセス
- ファイルの内容に従ってインデックスを制御

### 開発環境公開の問題

#### なぜ問題になるのか？
```
本番サイト: https://username.github.io/koanest_LP/
開発サイト: https://pr-dev--username-koanest-website.preview.github.dev/
```

**SEO問題：**
- 両方ともGoogleに登録されてしまう
- ユーザーが検索したときに「どっちが本物？」とGoogleが混乱
- 検索順位が下がる可能性

### SEO対策の実装

#### 1. HTML での noindex 設定（詳細コメント付き）

##### `index.html` の更新

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- 基本的なメタタグ -->
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>プロジェクト名</title>
    
    <!-- 開発環境SEO対策スクリプト -->
    <script>
      // 開発環境かどうかを判定する関数
      // プレビュー環境のURLパターンをチェック
      if (window.location.hostname.includes('.preview.github.dev') ||     // Preview Deployments
          window.location.hostname.includes('localhost') ||                // ローカル開発環境
          window.location.pathname.includes('-dev/')) {                   // 従来の開発環境パス
        
        // noindexメタタグを動的に作成・追加
        // これにより検索エンジンがこのページをインデックスしなくなる
        const noindexMeta = document.createElement('meta');
        noindexMeta.name = 'robots';                    // 検索エンジン向けの指示
        noindexMeta.content = 'noindex, nofollow';      // インデックス禁止、リンクフォロー禁止
        document.head.appendChild(noindexMeta);         // HTMLのheadタグに追加
        
        // 開発環境であることを視覚的に表示するバナー
        document.addEventListener('DOMContentLoaded', function() {
          // DOMが読み込まれてから実行（HTMLが完全に読み込まれるのを待つ）
          
          const devBanner = document.createElement('div');
          devBanner.innerHTML = '🚧 DEVELOPMENT ENVIRONMENT 🚧';
          
          // CSSスタイルを直接指定（外部CSSに依存しない）
          devBanner.style.cssText = `
            position: fixed;        /* 画面に固定表示 */
            top: 0;                /* 画面上部に配置 */
            left: 0;               /* 画面左端に配置 */
            right: 0;              /* 画面右端まで伸ばす */
            background: #ff6b6b;   /* 赤色の背景 */
            color: white;          /* 白色の文字 */
            text-align: center;    /* 中央揃え */
            padding: 8px;          /* 内側の余白 */
            font-weight: bold;     /* 太字 */
            z-index: 9999;         /* 他の要素より前面に表示 */
            font-size: 14px;       /* フォントサイズ */
          `;
          
          // バナーをページの最上部に追加
          document.body.prepend(devBanner);
          // バナーの分だけbodyの上部に余白を作る
          document.body.style.paddingTop = '40px';
        });
      }
    </script>
  </head>
  <body>
    <!-- Reactアプリケーションがマウントされる要素 -->
    <div id="root"></div>
    <!-- メインのJavaScriptファイルを読み込み -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 2. robots.txt の動的生成

**開発環境用：**
```
User-agent: *
Disallow: /
# 開発環境 - 検索エンジンにインデックスしない
```

**本番環境用：**
```
User-agent: *
Allow: /
Sitemap: https://username.github.io/koanest_LP/sitemap.xml
```

### 大手企業の開発環境管理

#### なぜ開発用のページは一般ユーザーに見えないのか？

##### 1. アクセス制限
- **IP制限**: 会社のIPアドレスからのみアクセス可能
- **VPN必須**: 社内VPN経由でないとアクセス不可
- **認証必須**: 社員アカウントでログインが必要

##### 2. 内部ドメインでの運用
```
本番: amazon.com
開発: dev.amazon.internal (社内ネットワークのみ)
ステージング: staging.amazon.internal (社内のみ)
```

#### A/Bテストと段階的リリース

**これらの設定はdeploy.ymlには記述しません**。企業レベルでは以下のような専用システムを使用：

**企業で使用される専用ツール：**
- **LaunchDarkly**: 機能フラグ管理
- **Optimizely**: A/Bテスト専用プラットフォーム
- **Google Optimize**: Googleの無料A/Bテストツール
- **Firebase Remote Config**: モバイルアプリ向け機能制御
- **AWS Route 53 加重ルーティングポリシー**: DNSレベルでトラフィックを重み付きに分割し、A/Bテストやカナリアリリースに利用可能

---

## 実装手順

### Phase 1: 初期設定

#### 0. 前提条件の確認とpnpmインストール

**Node.jsの確認：**
```bash
# Node.js 20以上が必要
node --version  # v20.0.0以上であることを確認
npm --version   # npmが使用可能であることを確認
```

**pnpmのインストール：**
```bash
# 方法1: npmを使用（最も簡単）
npm install -g pnpm

# 方法2: 公式インストールスクリプト（推奨）
# Linux/macOS
curl -fsSL https://get.pnpm.io/install.sh | sh

# Windows PowerShell
iwr https://get.pnpm.io/install.ps1 -useb | iex

# 方法3: corepackを使用（Node.js 16.13+）
corepack enable
corepack prepare pnpm@latest --activate

# インストール確認
pnpm --version  # 10.4.1が表示されればOK（このプロジェクトの推奨バージョン）
```

**なぜpnpmを使用するのか：**
- **パフォーマンス**: npmの3-5倍高速
- **ディスク効率**: シンボリックリンクで重複排除
- **厳密な依存関係**: phantom dependenciesを防止
- **モノレポ対応**: ワークスペース機能が強力

#### 1. GitHub Pagesの設定

```bash
# GitHubリポジトリで以下を設定：
# Settings > Pages > Source: "GitHub Actions" を選択
```

#### 2. プロジェクトファイルの準備

```bash
# プロジェクトルートで以下のファイルを作成・編集：

# 1. .github/workflows/deploy.yml を作成
# 役割：GitHub Actionsの自動デプロイ設定
mkdir -p .github/workflows
# 上記のワークフロー設定をコピー

# 2. vite.config.js を更新
# 役割：Viteビルドツールの設定（ベースパス、プラグインなど）
# 上記の設定に更新

# 3. package.json を更新
# 役割：npmスクリプトの定義（build、dev、deployコマンドなど）
# scriptsセクションを上記の設定に更新

# 4. index.html を更新
# 役割：SEO対策スクリプトを追加（noindex設定、開発環境バナー）
# SEO対策のスクリプトを追加
```

#### 必要なライブラリの確認とインストール

**前提条件：** pnpmがインストール済みであること（上記の手順0を参照）

```bash
# 基本的なVite + Reactプロジェクトの場合
pnpm install

# 追加で必要になる可能性があるライブラリ
# TailwindCSSを使用する場合
pnpm add -D tailwindcss @tailwindcss/vite

# TypeScriptを使用する場合
pnpm add -D typescript @types/react @types/react-dom

# ESLintを使用する場合
pnpm add -D eslint @eslint/js eslint-plugin-react
```

### Phase 2: 最初のデプロイ

#### 1. 本番環境へのデプロイ

```bash
# 現在のコードを本番環境にデプロイ
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main

# GitHub Actionsが自動実行される
# https://github.com/[username]/[repository]/actions で確認可能
```

#### 2. 開発環境の設定（オプション）

```bash
# 開発用ブランチを作成
git checkout -b develop
git push origin develop

# 開発環境にも自動デプロイされる
```

### Phase 3: 日常的な開発フロー

#### 1. 機能開発

```bash
# 新機能開発開始
git checkout develop
git pull origin develop
git checkout -b feature/new-awesome-feature

# 開発作業
# ファイル編集...

# コミット
git add .
git commit -m "Add awesome new feature"
git push origin feature/new-awesome-feature
```

#### 2. 開発環境での確認

```bash
# 開発環境に統合
git checkout develop
git merge feature/new-awesome-feature
git push origin develop

# 自動で開発環境にデプロイ
# https://[username].github.io/[project]-dev/ で確認
```

#### 3. 本番リリース

```bash
# 本番環境にリリース
git checkout main
git merge develop
git push origin main

# 自動で本番環境にデプロイ
# https://[username].github.io/[project]/ で確認
```

### Phase 4: 確認とモニタリング

#### 1. デプロイ状況の確認

```bash
# GitHub Actionsの実行状況を確認
# https://github.com/[username]/[repository]/actions

# デプロイされたサイトを確認
# 本番: https://[username].github.io/[project]/
# 開発: https://[username].github.io/[project]-dev/
```

#### 2. ログの確認

```bash
# GitHub Actionsのログを確認
# 1. GitHubリポジトリ > Actions
# 2. 該当のワークフロー実行をクリック
# 3. 各ステップのログを確認
```

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. デプロイが失敗する

**症状：**
- GitHub Actionsが赤色（失敗）になる
- サイトが更新されない

**確認方法：**
```bash
# 1. GitHub Actionsのログを確認
# GitHub > Actions > 失敗したワークフロー > ログを確認

# 2. ローカルでビルドテスト
pnpm run build

# 3. 依存関係の確認
pnpm install --frozen-lockfile
```

**よくある原因と解決：**

##### Node.jsバージョンの不一致
```yaml
# .github/workflows/deploy.yml で Node.js バージョンを確認
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # ローカルと合わせる
```

##### 依存関係のエラー
```bash
# pnpm-lock.yaml を更新
pnpm install
git add pnpm-lock.yaml
git commit -m "Update pnpm-lock.yaml"
git push
```

#### 2. 環境変数が反映されない

**症状：**
- 開発環境と本番環境で同じベースパスになる
- 環境ラベルが表示されない

**解決方法：**
```yaml
# .github/workflows/deploy.yml の env セクションを確認
env:
    VITE_BASE_PATH: ${{ github.ref == 'refs/heads/main' && '/koanest_LP/' || '/' }}
    VITE_ENV_LABEL: ${{ github.ref == 'refs/heads/develop' && 'DEVELOPMENT' || (github.event_name == 'pull_request' && 'PREVIEW' || 'PRODUCTION') }}
```

#### 3. SEO対策が効かない

**症状：**
- 開発環境が検索結果に表示される
- noindexが設定されていない

**確認方法：**
```bash
# 1. 開発環境のHTMLソースを確認
# ブラウザで開発環境にアクセス > 右クリック > ソースを表示
# <meta name="robots" content="noindex, nofollow"> があるか確認

# 2. robots.txt を確認
# https://[username].github.io/[project]-dev/robots.txt にアクセス
```

**解決方法：**
```html
<!-- index.html のスクリプトを確認・修正 -->
<script>
  // プレビュー環境の自動検出
  if (window.location.hostname.includes('.preview.github.dev')) {
    // noindex設定でSEO対策
    const noindexMeta = document.createElement('meta');
    noindexMeta.name = 'robots';
    noindexMeta.content = 'noindex, nofollow';
    document.head.appendChild(noindexMeta);
    
    // 開発環境バナー表示
    const banner = document.createElement('div');
    banner.innerHTML = `⚠️ ${process.env.VITE_ENV_LABEL} ENVIRONMENT`;
    document.body.prepend(banner);
  }
</script>
```

#### 4. ブランチ戦略の混乱

**症状：**
- どのブランチで作業すべきかわからない
- マージの順序がわからない

**解決フロー：**
```bash
# 基本ルール
# feature/* → develop → main

# 1. 新機能開発
git checkout develop
git checkout -b feature/my-feature

# 2. 開発環境でテスト
git checkout develop
git merge feature/my-feature
git push origin develop

# 3. 本番リリース
git checkout main
git merge develop
git push origin main
```

### 緊急時の対応

#### 1. 本番環境に問題がある場合

```bash
# 1. 前のコミットに戻す
git checkout main
git reset --hard HEAD~1  # 1つ前のコミットに戻す
git push origin main --force

# 2. または、安全なコミットを指定
git reset --hard [安全なコミットハッシュ]
git push origin main --force
```

#### 2. 開発環境を無効化したい場合

```yaml
# .github/workflows/deploy.yml で deploy-development ジョブをコメントアウト
# deploy-development:
#   if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
#   ...
```

---

## まとめ

### 実装完了後の状態

#### 環境構成
- **本番環境**: `https://[username].github.io/[project]/`
- **開発環境**: `https://[username].github.io/[project]-dev/`
- **プレビュー環境**: Pull Request時に自動ビルドチェック

#### 開発フロー
1. **機能開発**: `feature/*` ブランチで個別開発
2. **統合テスト**: `develop` ブランチで開発環境デプロイ
3. **本番リリース**: `main` ブランチで本番環境デプロイ

#### SEO対策
- 開発環境は `noindex` 設定
- 動的な `robots.txt` 生成
- 開発環境表示バナー

#### 自動化
- コミット時の自動ビルド・デプロイ
- 環境別の設定自動切り替え
- Pull Request時のプレビュー

この設定により、効率的で安全な開発・デプロイ環境が構築できます。

---

## GitHub Actions 技術詳細解説

### 1. 並行実行制御の必要性とconcurrency設定

#### 並行実行で起こりうる問題

```yaml
# 同じブランチで複数のワークフローが実行されないようにする設定
concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true
```

**具体的なシナリオ：**
- 開発者Aがmainブランチにpush → デプロイ開始（5分かかる）
- 2分後、開発者Bがmainブランチにpush → 2つ目のデプロイ開始
- 結果：古いコードが新しいコードを上書きする可能性

**発生する障害：**
- **競合状態**: 2つのデプロイが同時にgh-pagesブランチを更新
- **リソース競合**: GitHub Pagesの設定が競合
- **不整合**: 古いビルドが新しいビルドを上書き
- **無駄なリソース消費**: 不要なビルドが実行される

#### group文法の詳細解説

```yaml
group: pages-${{ github.ref }}
```

**文法構造：**
- `group:` - 並行実行グループの識別子
- `pages-` - 固定のプレフィックス（任意の文字列）
- `${{ }}` - GitHub Actionsの式構文
- `github.ref` - 現在のブランチ参照（例：`refs/heads/main`）

**実際の値例：**
- mainブランチ: `pages-refs/heads/main`
- developブランチ: `pages-refs/heads/develop`
- feature/loginブランチ: `pages-refs/heads/feature/login`

**動作原理：**
同じgroupの値を持つワークフローは並行実行されず、新しいものが古いものをキャンセルします。

### 2. Sitemapの役割と重要性

```
Sitemap: https://[username].github.io/project/sitemap.xml
```

**Sitemapとは：**
- Webサイトの構造を検索エンジンに伝えるXMLファイル
- どのページが存在するかを一覧化
- 各ページの重要度や更新頻度を指定

**robots.txtでの指定意味：**
- 検索エンジンに「このサイトのマップはここにあります」と伝える
- クローラーが効率的にサイトを巡回できる
- SEO効果の向上

**sitemap.xmlの例：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://username.github.io/project/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://username.github.io/project/about/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3. 環境変数の詳細文法解説

```yaml
env:
  VITE_BASE_PATH: ${{ github.ref == 'refs/heads/main' && '/project/' || '/project-dev/' }}
  VITE_ENV_LABEL: ${{ github.ref == 'refs/heads/develop' && 'DEVELOPMENT' || 'PRODUCTION' }}
```

#### 文法構造の詳細

**基本構文：**
- `${{ }}` - GitHub Actions式の構文
- `github.ref == 'refs/heads/main'` - 条件式（真偽値）
- `&&` - AND演算子（条件が真の場合）
- `||` - OR演算子（条件が偽の場合）

**三項演算子の動作：**
```javascript
// JavaScript風に書くと
const basePath = github.ref === 'refs/heads/main' ? '/project/' : '/project-dev/';
const envLabel = github.ref === 'refs/heads/develop' ? 'DEVELOPMENT' : 'PRODUCTION';
```

#### 変数の意味と役割

**BASE_PATHについて：**
- **BASE_PATH = ベースパス** です（同じ概念）
- Webアプリケーションのルートパスを指定
- `VITE_`プレフィックス：Viteビルドツールが認識する環境変数

**ENV_LABELについて：**
- 環境を識別するラベル
- UIに「DEVELOPMENT」「PRODUCTION」バナーを表示
- デバッグ情報の表示/非表示を制御

**なぜこの名前？**
- `BASE_PATH`: アプリケーションの基準パス
- `ENV_LABEL`: Environment Label（環境ラベル）
- `VITE_`: Viteが自動的に読み込む環境変数の命名規則

### 4. distディレクトリの意味

**dist = distribution（配布）の略**

**役割：**
- ビルド後の成果物を格納するディレクトリ
- ソースコード（TypeScript、JSX等）→ブラウザで実行可能なファイル（HTML、CSS、JS）
- 圧縮・最適化されたファイル

**構造例：**
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js    # ハッシュ付きファイル名
│   └── index-def456.css
└── favicon.ico
```

### 5. ジョブ実行条件の詳細

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:  # 条件なし = 全てのトリガーで実行
  
  deploy-production:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

**なぜpull_requestでもbuildするのか：**

1. **事前チェック**: マージ前にビルドエラーがないか確認
2. **品質保証**: 壊れたコードがmainブランチに入るのを防ぐ
3. **レビュー支援**: プレビュー環境でレビュアーが確認可能
4. **早期発見**: 問題を早い段階で発見

**実行フロー：**
- push → build + deploy
- pull_request → build のみ（deployはしない）

### 6. GitHub Actions出力の文法

```yaml
url: ${{ steps.deployment.outputs.page_url }}
```

**文法構造：**
- `steps.` - 同じジョブ内のステップを参照
- `deployment` - ステップのid
- `.outputs.` - そのステップの出力値
- `page_url` - 出力される値の名前

**実際の値例：**
```
https://username.github.io/project/
```

**使用例：**
```yaml
- name: Deploy to GitHub Pages
  id: deployment  # ←このidで参照
  uses: actions/deploy-pages@v4
  
- name: Output URL
  run: echo "Deployed to ${{ steps.deployment.outputs.page_url }}"
```

### 7. permissions設定の詳細

```yaml
permissions:
  pages: write      # GitHub Pagesへの書き込み権限
  id-token: write   # 認証トークンの書き込み権限
```

#### 権限の詳細説明

**何を制御しているか：**
- **pages: write**: gh-pagesブランチへの書き込み、Pages設定の変更
- **id-token: write**: OpenID Connect認証トークンの生成

**これがない場合の影響：**
```
Error: Resource not accessible by integration
```
- デプロイが失敗する
- GitHub Pagesの設定変更ができない

#### セキュリティ考慮事項

**リポジトリの公開設定：**
- **publicリポジトリ**: 誰でも見れるが、pushはできない
- **privateリポジトリ**: 招待されたユーザーのみアクセス可能
- **定石**: 企業では通常privateリポジトリを使用

**権限の最小化原則：**
```yaml
permissions:
  contents: read    # 読み取りのみ
  pages: write      # 必要な権限のみ
  id-token: write   # 必要な権限のみ
```

### 8. Checkoutの必要性とfetch-depth

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

#### なぜCheckoutが必要か

**必要な理由：**
1. **ブランチ操作**: gh-pagesブランチを作成・切り替え
2. **Git履歴**: コミット履歴が必要
3. **ワークフロー**: GitHub Actionsの基本的な前提

**fetch-depth: 0の意味：**
- `0`: 全ての履歴を取得
- `1`: 最新コミットのみ（デフォルト）
- `5`: 最新5コミット

**これがない場合の影響：**
```bash
fatal: not a git repository
```
- ブランチ操作ができない
- Git コマンドが失敗

#### デプロイフローの詳細

```yaml
# 1. ソースコードをダウンロード（Git操作のため）
- uses: actions/checkout@v4

# 2. ビルド済みファイルをダウンロード
- uses: actions/download-artifact@v4

# 3. 新しいブランチを作成
- run: git checkout --orphan gh-pages

# 4. 既存ファイルを削除（ソースコードを削除）
- run: git rm -rf .

# 5. ビルド済みファイルを配置
- run: cp -r ./dist-artifact/* .
```

**なぜこの手順が必要か：**
- Git操作にはリポジトリの履歴が必要
- 新しいブランチ作成には元のリポジトリが必要
- ビルド済みファイルは別ジョブから取得

### 9. アーティファクトのパラメータ詳細

```yaml
uses: actions/download-artifact@v4
with:
  name: github-pages      # アーティファクトの名前
  path: ./dist-artifact   # ダウンロード先のパス
```

#### パラメータの詳細説明

**name パラメータ：**
- アップロードされたアーティファクトの識別名
- 大文字小文字を区別する
- 英数字とハイフンのみ使用可能

**path パラメータ：**
- ダウンロード先のディレクトリパス
- 相対パスまたは絶対パスが指定可能
- 存在しないディレクトリは自動作成

**対応関係の例：**
```yaml
# アップロード時（buildジョブ）
- uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
    name: github-pages  # ←この名前で保存

# ダウンロード時（deployジョブ）
- uses: actions/download-artifact@v4
  with:
    name: github-pages  # ←同じ名前で取得
    path: ./dist-artifact
```

### 10. ジョブ間・ステップ間のデータ共有

#### データ共有の仕組み

**ジョブ間の共有：アーティファクト**
```yaml
jobs:
  build:
    steps:
      - uses: actions/upload-pages-artifact@v3  # 保存
  
  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v4      # 取得
```

**ステップ間の共有：outputs + id**
```yaml
steps:
  - name: Build
    id: build-step
    run: echo "result=success" >> $GITHUB_OUTPUT
  
  - name: Use Result
    run: echo "Build result: ${{ steps.build-step.outputs.result }}"
```

#### 比較表

| 項目 | アーティファクト | outputs |
|------|------------------|---------|
| 対象 | ジョブ間 | ステップ間 |
| データ | ファイル | 文字列 |
| 永続化 | あり（90日間） | なし |
| サイズ | 大きなファイル可 | 小さなデータ |
| 用途 | ビルド成果物 | 設定値・結果 |

### 11. GitHub API呼び出しの詳細文法

```javascript
github.rest.issues.createComment({
  issue_number: context.issue.number,
  owner: context.repo.owner,
  repo: context.repo.repo,
  body: '🚀 プレビュー環境でビルドが完了しました！'
})
```

#### 文法構造の詳細

**基本構造：**
- `github.rest` - GitHub REST APIクライアント
- `.issues.createComment` - APIエンドポイント
- `context.issue.number` - プルリクエスト番号
- `context.repo.owner` - リポジトリオーナー
- `