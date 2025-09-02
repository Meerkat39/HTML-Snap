## 🚀 ロードマップ

### 🔹 フェーズ 1（自分用 MVP）

1. **入力欄 + プレビュー**

   * textarea に HTML を入力
   * DOMPurify でサニタイズ
   * iframe sandbox でレンダリング

2. **最低限の XSS 対策**

   * `<script>` タグ・イベント属性を禁止
   * style は許可

---

### 🔹 フェーズ 2（便利機能追加）

3. **画像コピー機能**

   * `html2canvas` / `dom-to-image` でプレビューを PNG 化
   * `navigator.clipboard.write` でクリップボードにコピー

4. **トリミング / 要素指定保存**

   * `canvas` を部分的に切り出し
   * DOM 要素単位でキャプチャ

---

### 🔹 フェーズ 3（公開版 α）

5. **セキュリティ強化**

   * DOMPurify にホワイトリスト導入
   * iframe sandbox 制限を強める

6. **UI 改善**

   * ペースト → 即レンダリングの流れをスムーズに

---

### 🔹 フェーズ 4（公開版 β）

7. **サーバーサイドレンダリング導入**

   * Next.js API Routes / Route Handlers + Puppeteer
   * HTML をサーバーでレンダリングして画像を返す

8. **本番公開**

   * Vercel / Render などにデプロイ
   * 公開ユーザーが使えるように

---