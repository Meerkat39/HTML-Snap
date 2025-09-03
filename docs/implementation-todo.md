# 実装タスク一時メモ

このファイルは、実装単位で細かく分割した TODO やアイデア、作業中のタスクを一時的に記録するためのメモです。

---

## TODO

### プレビュー領域の iframe sandbox 化（安全な分離表示）

#### 実装タスク洗い出し（iframe sandbox プレビュー）

    - [ ] PreviewPaneをiframe化し、sandbox属性を付与
    - [ ] 入力HTMLをiframeのsrcDocで描画
    - [ ] sandbox属性値を明示（例: "allow-scripts allow-same-origin"）
    - [ ] PreviewPaneの既存dangerouslySetInnerHTML描画をiframe方式に置換
    - [ ] styleタグ・属性の反映確認（iframe内でのみ有効化）
    - [ ] 画像コピー機能：iframe外にhiddenなdivを用意し、同じHTMLを描画して画像化
    - [ ] ズーム・スクロールUIのiframe対応（iframeのwidth/height/scale調整）
    - [ ] サニタイズ仕様：scriptタグ除去のみ維持、styleは許可
    - [ ] テストコード：iframeプレビューの表示・安全性・UI崩れ防止
