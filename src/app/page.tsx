// メインページ初期化：主要コンポーネントの配置（中身は未実装）
"use client";
import React, { useState } from "react";
import Header from "../components/common/Header";
import InputPane from "../components/input/InputPane";
import PreviewPane from "../components/preview/PreviewPane";

export default function Home() {
  // 入力値の状態管理（親で一元管理）
  const [inputValue, setInputValue] = useState("");

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
      <div className="container max-w-5xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        {/* ヘッダー */}
        <Header />
        {/* メイン2ペイン */}
        <main className="flex flex-col md:flex-row h-[70vh]">
          <InputPane
            value={inputValue}
            onChange={handleInputChange}
            onPasteSanitized={handlePasteSanitized}
          />
          <PreviewPane html={inputValue} />
        </main>
      </div>
    </div>
  );
}
