// メインページ初期化：主要コンポーネントの配置（中身は未実装）
"use client";
import Header from "../features/snap/main/components/Header";
import MainPane from "../features/snap/main/components/MainPane";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-[1360px] w-full bg-white rounded-xl shadow-md overflow-hidden mx-auto">
        {/* ヘッダー */}
        <Header />
        {/* 表示モード切替＋ペイン分岐 */}
        <main className="h-[70vh]">
          <MainPane />
        </main>
      </div>
    </div>
  );
}
