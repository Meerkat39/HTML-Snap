#!/bin/bash
# CI（GitHub Actions）と同じ流れをローカルDocker環境で再現するスクリプト
# 実行例: bash scripts/ci-verify.sh
set -e

# 1. Dockerイメージをビルド
echo "[0/6] 既存のDockerイメージを削除（クリーンビルド）"
docker rmi -f html-snap-ci 2>/dev/null || true

echo "[1/6] Dockerイメージをビルド"
docker build -t html-snap-ci .

echo "[2/6] Lintチェック"
docker run --rm html-snap-ci npm run lint

echo "[3/6] 型チェック"
docker run --rm html-snap-ci npm run type-check

echo "[4/6] 単体テスト（Jest）"
docker run --rm html-snap-ci npm test

echo "[5/6] 本番ビルド（Next.js）"
docker run --rm html-snap-ci npm run build

# 6. サーバー起動→E2Eテスト→サーバー停止


# E2Eテスト用ブラウザバイナリを必ずインストール（初回/CI環境対策）
echo "[6/6] E2Eテスト（Playwright）: ブラウザバイナリをインストール"
docker run --rm html-snap-ci npx playwright install --with-deps

# 既存のhtml-snap-e2eコンテナを削除（存在すれば）
echo "[E2E] 既存のhtml-snap-e2eコンテナを削除"
docker rm -f html-snap-e2e 2>/dev/null || true

docker run -d -p 3000:3000 --name html-snap-e2e html-snap-ci npm run start
sleep 10  # サーバー起動待ち

docker run --network host --rm html-snap-ci bash -c "npx playwright install --with-deps && npx playwright test e2e/"

docker stop html-snap-e2e

echo "[後処理] 未使用Dockerイメージをクリーンアップ"
docker image prune -f
echo "\n✅ CI相当の検証がすべて完了しました"
