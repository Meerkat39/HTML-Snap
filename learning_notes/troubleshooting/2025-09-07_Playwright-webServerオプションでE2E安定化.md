# Playwright webServer オプションで E2E テストが安定した理由

## 📅 学習日時

2025 年 9 月 7 日

## ✅ 結論

- Playwright の`webServer`オプションを使うことで、Next.js サーバーの起動・待機・テスト実行が一括で自動化され、E2E テストが安定して動作するようになった
- これにより「手動でサーバーを立ち上げてからテストを実行」する必要がなくなり、タイミング問題やポート競合、アクセス不可などのトラブルが解消された

## 🧠 詳細

### 背景・問題

- Playwright の E2E テストを手動で実行していた際、`page.goto`でタイムアウト・about:blank・アクセス不可などの問題が頻発
- サーバー起動タイミングやネットワーク競合、セキュリティソフトの影響など、環境依存の不安定さがあった
- codegen（手動操作）は開けるのに、test ランナー（自動）は失敗する現象も発生

### 解決策

- Playwright の`playwright.config.ts`に`webServer`オプションを追加
  - 例:
    ```ts
    import { defineConfig } from "@playwright/test";
    export default defineConfig({
      webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
      },
      use: { baseURL: "http://localhost:3000" },
    });
    ```
- これにより、テスト実行時に「Next.js サーバーの自動起動 → 起動完了まで待機 →E2E テスト → 自動停止」まで一括で管理される
- テストコード側も`baseURL`を使うことで、URL のハードコーディングやタイミング調整が不要に

### 効果・メリット

- サーバー起動タイミングやポート競合、手動操作の手間が一切不要に
- テスト実行コマンド 1 つで「サーバー起動 →E2E テスト → サーバー停止」まで自動化
- CI 環境でも安定して E2E テストが動作する
- Playwright 公式推奨の方法であり、今後の保守性・拡張性も高い

### まとめ

- E2E テストの安定化には`webServer`オプションの活用が最重要
- 手動起動・タイミング調整・ネットワーク競合などのトラブルを根本から解消できる
