// プレビューペイン（RenderArea＋ActionButtonsをラップ）
import html2canvas from "html2canvas-pro";
import { useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import ZoomControls from "./ZoomControls";

type PreviewPaneProps = {
  html: string;
};

const PreviewPane = ({ html }: PreviewPaneProps) => {
  // プレビュー領域のref
  const previewRef = useRef<HTMLDivElement>(null);
  // 通知表示用state
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // ズーム倍率の状態管理（ZoomControlsから受け取る）
  const [zoom, setZoom] = useState(1.0);

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

  // ズーム用styleタグをsrcDocに埋め込む（枠サイズはそのまま、中身だけ拡大・縮小）
  const zoomStyle = `<style>body { transform: scale(${zoom}); transform-origin: top left; }</style>`;
  const iframeHtml = zoomStyle + html;

  return (
    <section className="flex-1 flex flex-col relative h-full">
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
          <ZoomControls onZoomChange={setZoom} />
          <ActionButtons onImageCopy={handleImageCopy} />
        </div>
      </div>
      {/* プレビュー表示領域（iframeで分離表示） */}
      <div
        className="flex-1 w-full h-full min-w-0 min-h-0 p-6 bg-white overflow-hidden flex items-stretch justify-stretch"
        style={{ maxWidth: "600px", maxHeight: "400px", height: "100%" }}
      >
        <iframe
          title="HTMLプレビュー"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={iframeHtml}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "0",
            minWidth: "0",
            border: "none",
            display: "block",
            boxSizing: "border-box",
            background: "white",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    </section>
  );
};

export default PreviewPane;
