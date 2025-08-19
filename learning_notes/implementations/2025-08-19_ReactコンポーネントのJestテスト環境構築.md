# React コンポーネントの Jest テスト環境構築

## 📅 学習日時

2025 年 8 月 19 日

## ✅ 結論

Next.js(TypeScript)環境で Jest ＋ React Testing Library によるコンポーネントテストを動かすには、Jest/ts-jest のバージョン整合・jsdom 環境・transform 設定・型定義・tsconfig の jsx オプションなど複数のポイントを正しく設定する必要がある。

## 🧠 詳細

- Jest/ts-jest は安定版（v29 系）で揃えるとトラブルが少ない
- jest.config.js で`preset: 'ts-jest'`、`testEnvironment: 'jsdom'`、`transform`（ts/tsx→ts-jest）を明記
- `jest-environment-jsdom`は Jest28 以降は別途インストールが必要
- `@testing-library/react`と`@testing-library/jest-dom`、型定義（@types/jest, @types/testing-library\_\_react）も必須
- tsconfig.json の`jsx`は`react-jsx`にすることで JSX 構文エラーを防げる
- package.json の test スクリプトは`npx jest`が Windows 環境でも安定
- テストファイル先頭で`import '@testing-library/jest-dom'`を追加すると拡張マッチャが使える

### 参考設定例

```js
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
```

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "jsx": "react-jsx"
  }
}
```

### 実装手順

1. Jest/ts-jest のインストール（バージョン整合）
2. jest-environment-jsdom のインストール
3. React Testing Library ＋型定義のインストール
4. jest.config.js・tsconfig.json の設定
5. package.json の test スクリプトを`npx jest`に
6. テストファイル先頭で jest-dom を import
7. テスト実行で通ることを確認

### トラブル例

- JSX 構文エラー：tsconfig の jsx 設定ミス
- Jest プリセットエラー：ts-jest 未インストール or バージョン不整合
- jsdom 環境エラー：jest-environment-jsdom 未インストール
- toBeInTheDocument 型エラー：jest-dom 未 import

---

この手順・設定で Next.js ＋ TypeScript の React コンポーネントテストが安定して動作するようになった。
