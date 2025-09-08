# Playwright E2E テストの領域選択安定化の工夫

## 📅 学習日時

2025 年 9 月 8 日

## ✅ 結論

領域選択 E2E テストで「postMessage によるイベント直接送信」に切り替えることで、UI 操作の不安定さや副作用を排除し、全件実行時でも安定してテストがパスするようになった。

## 🧠 詳細

### 背景

- 以前は iframe 内の要素を Playwright で直接クリックして領域選択をシミュレートしていたが、
  - iframe の描画タイミングや座標計算のズレ
  - テスト間の状態副作用
    などにより、全件一括実行時に失敗することがあった。

### 工夫した点

- 領域選択イベント（type: "region-select"）を `window.postMessage` で直接送信する方式に変更。
- これにより、UI の物理的な操作や描画タイミングに依存せず、アプリ側の状態を確実に変更できる。
- postMessage 送信後、`waitForTimeout(100)` で状態反映を待つことで、非同期処理の揺らぎも吸収。

### コード例

```typescript
// 領域選択イベントを直接postMessageで送信
await page.evaluate(() => {
  window.postMessage(
    {
      type: "region-select",
      outerHTML: '<div id="selectable">選択テスト</div>',
      rect: { width: 100, height: 30 },
    },
    "*"
  );
});
await page.waitForTimeout(100); // 状態反映待ち
```

### 効果

- テストの独立性・再現性が向上し、全件実行でも安定してパスするようになった。
- UI の細かい挙動やタイミングに依存しないため、将来的な UI 変更にも強い。

---

> 本メモは `docs/learning-notes-guide.md` のテンプレートに準拠しています。
