# JSDoc コメント運用ルール

このドキュメントは、HTML Snap プロジェクトにおける JSDoc コメントの記述・管理ルールをまとめたものです。

---

## 基本方針

- 型定義（types/配下）や Props 型には必ず JSDoc コメントを付与する
- 関数・カスタムフック・ユーティリティ関数・関数コンポーネントにも JSDoc コメントを推奨する
- JSDoc コメントは型定義ファイル側に一元管理し、実装ファイル側は簡潔に保つ
- コメントは「何を・なぜ・使い方」を意識し、第三者が見ても意図が伝わるように書く
- Storybook や自動ドキュメント生成ツールと連携しやすい形を意識する

---

## 主に JSDoc を書くと良い対象と例

### 1. コンポーネント

```ts
/**
 * ボタンコンポーネント
 *
 * @param {Object} props - プロパティ
 * @param {string} props.label - ボタンに表示するテキスト
 * @param {() => void} props.onClick - クリック時に呼ばれる関数
 */
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

props の型や役割を明記しておくと、再利用時に迷わない。

### 2. カスタムフック

```ts
/**
 * カウントを管理するカスタムフック
 *
 * @param {number} initialValue - 初期値
 * @returns {{ count: number, increment: () => void }}
 */
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}
```

返り値の構造を明示することで、利用側が理解しやすい。

### 3. ユーティリティ関数

```ts
/**
 * 指定した数値を百分率に変換する
 *
 * @param {number} value - 数値
 * @param {number} total - 母数
 * @returns {string} パーセント文字列 (例: "45%")
 */
export function toPercent(value, total) {
  return `${Math.round((value / total) * 100)}%`;
}
```

計算系やフォーマット系の関数はドキュメント化しておくと便利。

---

## 運用ルール

- 型定義・Props 型には必ず JSDoc コメントを付与する
- 関数・カスタムフック・ユーティリティ関数・関数コンポーネントにも JSDoc コメントを推奨する
- コメントは日本語で簡潔に（必要に応じて英語も併記可）
- 実装ファイル側の JSDoc は最小限にし、詳細は types/配下に集約
- 既存型や関数の修正・追加時も JSDoc を必ず更新する
- Storybook や TypeDoc 等の自動ドキュメント生成を意識した記法を推奨

---

## 備考

- コメント運用ルールはプロジェクトの成長に応じて随時見直し・改善する
- 具体例やベストプラクティスも随時追記する
