# Dockerfile 運用ガイド（HTML-Snap プロジェクト）

## 目的

- ローカル・CI 間の環境差をなくし、テスト・ビルド・品質担保を安定化する
- Node.js/Next.js/TypeScript/Jest/Babel などの依存を完全に固定

## 基本方針

- Dockerfile で「開発・検証・CI 用の環境」を明示的に定義
- コマンドはコンテナ内で実行（npm run lint, test, build, verify 等）
- デフォルトコマンドは品質チェック一括（verify）に設定
- イメージ名は html-snap-ci で統一

## 運用手順

1. Dockerfile をプロジェクトルートに配置
2. 依存・設定変更時は必ず `docker build -t html-snap-ci .` で再ビルド
3. **push前に必ずローカルで `docker run --rm html-snap-ci` で品質チェック（verify）を実行し、すべてpassしたらコミット・pushする**
4. CI でも同じイメージ・コマンドで検証

## Dockerfile 例

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "verify"]
```

## よくあるトラブル・注意点

- 依存追加・package.json 修正後は必ず再ビルド
- Next.js 本番では tsconfig の jsx は preserve 推奨
- Babel/ts-jest のバージョン整合も重要
- コマンド指定で CMD は上書き可能

## 参考運用例

- コミット前に `docker run --rm html-snap-ci` で品質担保
- CI ワークフローでも `docker build`→`docker run` で検証

---

このガイドに従うことで、環境差・依存トラブルを防ぎ、安定した開発・運用が可能になります。
