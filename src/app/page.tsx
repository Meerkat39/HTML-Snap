// メインページ初期化：主要コンポーネントの配置（中身は未実装）
"use client";
import React, { useState } from "react";
import Header from "../components/common/Header";
import MainPane from "../components/main/MainPane";

export default function Home() {
  // 入力値の状態管理（親で一元管理）
  // デバッグ用：初期値にサンプルHTMLを設定
  const [inputValue, setInputValue] = useState(`
    <div style="padding:16px; background:#f9f9f9; border-radius:8px;">
      <h1>HTML Snap デバッグサンプル</h1>
      <p>これはテスト用の初期HTMLです。<br>複数行・タグ・スタイルを含みます。</p>
      <ul>
        <li>リスト1</li>
        <li>リスト2</li>
        <li>リスト3</li>
      </ul>
      <img src="https://placehold.jp/150x80.png" alt="ダミー画像" />
    </div>
  `);

  // 入力イベントハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // ペースト時サニタイズ用コールバック
  const handlePasteSanitized = (sanitized: string) => {
    // サニタイズ済みHTMLを安全に状態更新
    setInputValue(sanitized);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-[1360px] w-full bg-white rounded-xl shadow-md overflow-hidden mx-auto">
        {/* ヘッダー */}
        <Header />
        {/* 表示モード切替＋ペイン分岐 */}
        <main className="h-[70vh]">
          <MainPane
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onPasteSanitized={handlePasteSanitized}
          />
        </main>
      </div>
    </div>
  );
}
