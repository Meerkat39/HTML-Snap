# ディレクトリ構成

HTML Snap プロジェクトのディレクトリ構成と役割についてまとめます。

## 基本構成（例）

```
html-snap/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── ...
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── InputArea.tsx
│   │   ├── RenderArea.tsx
│   │   └── ActionButtons.tsx
│   ├── types/
│   │   └── ...
│   ├── lib/
│   │   └── ...
│   └── ...
├── public/
│   └── ...
├── docs/
│   └── ...
├── learning_notes/
│   └── ...
├── package.json
├── README.md
└── ...
```

## 各ディレクトリの役割

- `src/app/` : Next.js のルーティング・ページ・グローバル CSS
- `src/components/` : UI コンポーネント群
- `src/types/` : 型定義（TypeScript の interface や type など）
- `src/lib/` : 汎用的な関数・ロジック・ユーティリティ
- `public/` : 画像・SVG などの静的ファイル
- `docs/` : 仕様書・運用ルール・設計ドキュメント
- `learning_notes/` : 技術的な学びやトラブル解決メモ

今後、必要に応じて構成や役割を拡張・修正します。

---

## 実装方針

- UI は役割ごとにコンポーネントとして分割・管理する
- ビジネスロジックや汎用関数は `lib/` にまとめる
- 型定義は `types/` に分離し、型安全・再利用性を高める
- ディレクトリごとに責務を明確にし、保守性・拡張性を意識して設計する
