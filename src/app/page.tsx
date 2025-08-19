// メインページ初期化：主要コンポーネントの配置（中身は未実装）
import ActionButtons from "../components/ActionButtons";
import InputArea from "../components/InputArea";
import RenderArea from "../components/RenderArea";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="container max-w-5xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        {/* ヘッダー */}
        <header className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">📸 HTML Snap</h1>
        </header>
        {/* メイン2ペイン */}
        <main className="flex flex-col md:flex-row h-[70vh]">
          {/* 左ペイン：HTML入力 */}
          <section className="flex-1 border-b-2 md:border-b-0 md:border-r-2 border-gray-200 flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              📝 HTMLコード入力
            </div>
            <div className="flex-1 p-6">
              <InputArea />
            </div>
          </section>
          {/* 右ペイン：プレビュー＋操作 */}
          <section className="flex-1 flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <span>🖼️ プレビュー</span>
              <div>
                <ActionButtons />
              </div>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center bg-white">
              <RenderArea />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
