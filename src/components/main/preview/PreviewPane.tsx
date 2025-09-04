// プレビューペイン（RenderArea＋ActionButtonsをラップ）
import html2canvas from "html2canvas-pro";
import { useEffect, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import PreviewIframeArea from "./PreviewIframeArea";
import SliderWidthControl from "./SliderWidthControl";
import ZoomControls from "./ZoomControls";

type PreviewPaneProps = {
  html: string;
};

const PreviewPane = ({ html }: PreviewPaneProps) => {
  // 画像コピー用 hidden div の参照
  const hiddenPreviewRef = useRef<HTMLDivElement>(null);
  // プレビュー枠の横幅（px）
  const [previewWidth, setPreviewWidth] = useState(600);
  // プレビューペインの最大幅
  const [paneMaxWidth, setPaneMaxWidth] = useState(1200);
  const paneRef = useRef<HTMLDivElement>(null);

  // ペインの幅をResizeObserverで取得し、最大値として反映
  useEffect(() => {
    const updateWidth = () => {
      const width = paneRef.current?.offsetWidth;
      if (width) {
        setPaneMaxWidth(width);
        setPreviewWidth((w) => Math.min(w, width));
      }
    };
    updateWidth();
    if (paneRef.current) {
      const observer = new window.ResizeObserver(updateWidth);
      observer.observe(paneRef.current);
      return () => observer.disconnect();
    }
    return;
  }, []);
  // プレビュー領域のref（未使用のため削除）
  // 通知表示用state
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // ズーム倍率の状態管理（ZoomControlsから受け取る）
  const [zoom, setZoom] = useState(1.0);

  // 画像生成処理（ActionButtonsに渡す）
  const handleImageCopy = async () => {
    const target = hiddenPreviewRef.current; // hidden divのrefを参照
    if (!target) {
      setError("画像化対象のhiddenPreviewRefがnullです");
      return;
    }
    try {
      const canvas = await html2canvas(target, {
        backgroundColor: "#fff", // 背景を白に固定
        scale: window.devicePixelRatio,
      });
      canvas.toBlob(async (blob: Blob | null) => {
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
        } catch {
          setError("クリップボードへのコピーに失敗しました");
          setTimeout(() => setError(""), 3000);
        }
      }, "image/png");
    } catch {
      setError("画像化処理でエラーが発生しました");
      return;
    }

    // （重複していたcanvas.toBlob呼び出しを削除）
  };

  // ズーム用styleタグをsrcDocに埋め込む（枠サイズはそのまま、中身だけ拡大・縮小）
  const zoomStyle = `<style>body { transform: scale(${zoom}); transform-origin: top left; }</style>`;
  const iframeHtml = zoomStyle + html;

  return (
    <section className="flex-1 flex flex-col relative h-full" ref={paneRef}>
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
          <SliderWidthControl
            width={previewWidth}
            max={paneMaxWidth}
            onChange={setPreviewWidth}
          />
          <ZoomControls onZoomChange={setZoom} />
          <ActionButtons onImageCopy={handleImageCopy} />
        </div>
      </div>
      {/* プレビュー表示領域（iframeで分離表示） */}
      <PreviewIframeArea
        iframeHtml={iframeHtml}
        width={previewWidth}
        height={400}
      />
      {/* hidden div（画像化用）をsection内に必ず描画。画像コピー時はこのdivをhtml2canvas対象にする。 */}
      <div
        ref={hiddenPreviewRef}
        style={{
          position: "absolute", // 画面外に配置
          left: "-9999px",
          top: 0,
          width: previewWidth,
          zoom: zoom,
          background: "#fff",
          pointerEvents: "none",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
};

export default PreviewPane;
