# Node.js公式イメージ（22系）をベースにする
FROM node:22

# 作業ディレクトリを作成・移動
WORKDIR /app

# 依存インストール用ファイルのみ先にコピー
COPY package*.json ./

# 依存パッケージをクリーンインストール
RUN npm ci

# プロジェクト全体をコンテナにコピー
COPY . .

# デフォルトコマンド（品質チェック一括実行）
CMD ["npm", "run", "verify"]
