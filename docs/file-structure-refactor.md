# ファイル設計・ディレクトリ構成リファクタリング方針

このドキュメントは、HTML Snap プロジェクト全体のファイル設計・ディレクトリ構成の見直し・リファクタリング方針をまとめるものです。

## 目的

- コードの可読性・保守性・拡張性の向上
- Atomic Design や Bulletproof-React などの設計思想の“良いとこ取り”を実践
- プロジェクトの成長に合わせて柔軟に運用できる構成を目指す

## 進め方（例）

1. 現状の課題・理想像の整理
2. 設計思想（Atomic Design/Bulletproof-React 等）の良い点をピックアップ
3. 自分なりのルールを決める
4. 小さく設計・リファクタを始める
5. 設計指針をドキュメント化し、随時見直す

## メモ・アイデア

- どの粒度で分けるか、どこから着手するか、迷った点・気づきなどもここに記録

---

（このファイルに自由に追記・編集してください）

## Bulletproof-React 流 ディレクトリ構造例

```
src/
	features/                # 機能単位でまとめる（UI・ロジック・型・テストも同居OK）
		snap/
			components/
				...
			hooks/
				...
			types.ts
			utils.ts
			index.ts
			tests/
				...
		user/
			...
		...
	components/              # 本当に汎用的なUI部品のみ（Button, Modalなど）
		Button.tsx
		Modal.tsx
		...
	hooks/                   # 全体で使う汎用フック
		useClipboard.ts
		...
	utils/                   # 全体で使う汎用ロジック
		html.ts
		...
	types/                   # 全体で使う型
		snap.ts
		...
	pages/                   # Next.jsのページ
		index.tsx
		api/
			html2image.ts
		...
	styles/                  # グローバルCSSやTailwind設定
		globals.css
		...
	__tests__/               # テスト（または各ディレクトリ内にtests/を置く）
public/
	...（画像・静的ファイル）
docs/
	...（設計方針・運用ルールなどドキュメント）
```

### ポイント

- features/配下に「機能ごと」の UI・ロジック・型・テストを集約
- components/は本当に汎用的なものだけ
- hooks/utils/types は全体で使うものを集約
- テストは tests/や各ディレクトリ内に配置も OK

この構成なら、機能ごとに必要なファイルが近く、迷わず編集・追加できる。
