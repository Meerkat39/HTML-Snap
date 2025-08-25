# Tailwind CSS `prose` クラス活用ガイド

## 概要

`prose` クラスは Tailwind CSS の公式プラグイン `@tailwindcss/typography` によって提供される、文章・記事・Markdown などの HTML を美しく整形するためのユーティリティです。

---

## 主な特徴

- h1, h2, p, ul, li, blockquote など、文章タグに最適なデフォルトスタイルが自動で適用される
- 余白・フォントサイズ・リストマーク・見出しの大きさ・リンク色などが一括で整う
- Markdown やブログ、記事表示、プレビュー領域などに最適

---

## 使い方

1. プラグイン導入
   ```bash
   npm install @tailwindcss/typography
   ```
2. CSS で有効化（`globals.css` 例）
   ```css
   @import "tailwindcss";
   @plugin "@tailwindcss/typography";
   ```
3. コンポーネントで利用
   ```jsx
   <div className="prose">{/* ここにHTMLやMarkdownを描画 */}</div>
   ```

---

## 実装例

```jsx
<div className="prose prose-sm max-w-none">
  <h1>見出しテスト</h1>
  <p>これは段落です。</p>
  <ul>
    <li>リスト1</li>
    <li>リスト2</li>
  </ul>
</div>
```

---

## 注意点・Tips

- `prose` クラスは文章向けの装飾が中心。フォームやボタンなどには適用しない
- サイズや色は `prose-sm`, `prose-lg`, `prose-blue` などで調整可能
- Markdown プレビューやブログ記事、説明文の表示に特に有効

---

## 参考

- [Tailwind Typography 公式ドキュメント](https://tailwindcss.com/docs/typography-plugin)
- [Tailwind CSS 公式サイト](https://tailwindcss.com/)

---

> 本ガイドは HTML Snap プロジェクトの UI 実装・学習共有のために作成しています。
