// プレビューペイン（RenderArea＋ActionButtonsをラップ）
import html2canvas from "html2canvas-pro";
import { useRef, useState } from "react";
import RenderArea from "../../render/RenderArea";
import ActionButtons from "./ActionButtons";

type PreviewPaneProps = {
  html: string;
};

const PreviewPane = ({ html }: PreviewPaneProps) => {
  // プレビュー領域のref
  const previewRef = useRef<HTMLDivElement>(null);
  // 通知表示用state
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // 画像生成処理（ActionButtonsに渡す）
  const handleImageCopy = async () => {
    if (!previewRef.current) return;
    // html2canvasで画像化
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: "#fff", // 背景を白に固定
    }); // html2canvas-proはoklch対応
    // 画像データURL取得
    const dataUrl = canvas.toDataURL("image/png");
    console.log("画像データURL:", dataUrl);

    // 画像をクリップボードにコピー
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError("画像データの生成に失敗しました");
        setTimeout(() => setError(""), 3000);
        return;
      }
      try {
        await navigator.clipboard.write([
          new window.ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true); // 通知表示
        setTimeout(() => setCopied(false), 2000); // 2秒後に非表示
        console.log("画像をクリップボードにコピーしました");
      } catch (err) {
        setError("クリップボードへのコピーに失敗しました");
        setTimeout(() => setError(""), 3000);
        console.error("クリップボードコピー失敗:", err);
      }
    }, "image/png");
  };

  return (
    <section className="flex-1 flex flex-col relative">
      {/* コピー完了通知 */}
      {copied && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          画像をクリップボードにコピーしました
        </div>
      )}
      {/* エラー通知 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
          {error}
        </div>
      )}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <span>🖼️ プレビュー</span>
        <div className="flex gap-2 items-center">
          {/* ズーム操作ボタン群（UIのみ、状態管理は次ステップ） */}
          <button className="px-2 py-1 border rounded bg-white" title="ズームアウト">−</button>
          <span className="px-2">100%</span>
          <button className="px-2 py-1 border rounded bg-white" title="ズームイン">＋</button>
          <button className="px-2 py-1 border rounded bg-white" title="リセット">⟳</button>
          {/* 既存の画像コピーボタン */}
          <ActionButtons onImageCopy={handleImageCopy} />
        </div>
      </div>
      <div className="flex-1 p-6 flex items-center justify-center bg-white">
        {/* 画像化したい領域にrefを付与 */}
        <div ref={previewRef} className="w-full h-full">
          <RenderArea html={html} />
        </div>
      </div>
    </section>
  );
};

export default PreviewPane;
