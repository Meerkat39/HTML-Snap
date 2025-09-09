import RegionCopyIcon from "../../icons/RegionCopyIcon";
// プレビューペイン（RenderArea＋ActionButtonsをラップ）
import { useEffect, useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import PreviewIframeArea from "./PreviewIframeArea";
import SliderWidthControl from "./SliderWidthControl";
import ZoomControls from "./ZoomControls";

type PreviewPaneProps = {
  html: string;
};

const PreviewPane = ({ html }: PreviewPaneProps) => {
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

  // 選択領域のouterHTMLを管理
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  // rect情報も受信してstateで保持
  const [selectedRect, setSelectedRect] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // 選択領域の画像コピー（styleも含めて合成）
  const handleRegionImageCopy = async () => {
    if (!selectedRegion) return;
    try {
      // head内のstyleやmeta等を元htmlから抽出
      const headMatch = html.match(/<head[\s\S]*?>[\s\S]*?<\/head>/i);
      let head = headMatch ? headMatch[0] : "";
      // head内の<style>からbodyのbackground/background-color指定だけを除去
      head = head.replace(
        /(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/gi,
        (match, p1, p2, p3) => {
          // body { ...background... } のbackground系プロパティを除去
          const newCss = p2.replace(
            /body\s*\{[^}]*\}/gi,
            (bodyBlock: string) => {
              // body { ... } の中身からbackground系だけ除去
              const cleaned = bodyBlock.replace(
                /background(-color)?\s*:[^;]+;?/gi,
                ""
              );
              return cleaned;
            }
          );
          // .html-snap-region-highlightクラスのスタイルも除去
          const noHighlight = newCss.replace(
            /\.html-snap-region-highlight\s*\{[^}]*\}/gi,
            ""
          );
          return p1 + noHighlight + p3;
        }
      );

      // head内にリセットCSSを必ず追加
      // 余白系のみリセット
      const resetCss = `<style>html,body{margin:0!important;padding:0!important;border:none!important;box-sizing:border-box!important;}</style>`;
      head = head.replace(/<\/head>/i, resetCss + "</head>");

      // 選択領域HTMLからハイライト用クラス・style属性・余白を除去
      const cleanedRegion = selectedRegion
        // .html-snap-region-highlightクラスを除去
        .replace(
          /\s*class=("|')([^"']*\bhtml-snap-region-highlight\b[^"']*)("|')/gi,
          (m, q1, classes, q2) => {
            // 他のクラスがあれば残す
            const filtered = (classes as string)
              .split(/\s+/)
              .filter((c: string) => c !== "html-snap-region-highlight")
              .join(" ");
            return filtered ? ` class=${q1}${filtered}${q2}` : "";
          }
        )
        // style属性からoutline, box-shadow, margin, padding, background系を除去
        .replace(/style=("|')([^"']*)("|')/gi, (m, q1, styleStr, q2) => {
          const filtered = (styleStr as string)
            .split(";")
            .map((s: string) => s.trim())
            .filter(
              (s: string) =>
                s &&
                !/^(outline|box-shadow|margin|padding|background(-color)?)/i.test(
                  s
                )
            )
            .join("; ");
          return filtered ? ` style=${q1}${filtered}${q2}` : "";
        });

      // body直下の要素に余白リセットstyleを強制付与
      const cleanedRegionWithReset = cleanedRegion.replace(
        /^(<[^>]+)(>)/,
        (m: string, tagStart: string, tagEnd: string) => {
          // 既にstyle属性があれば追記、なければ新規追加
          if (/style=/.test(tagStart)) {
            return (
              tagStart.replace(
                /style=("|')([^"']*)("|')/,
                (sm: string, q1: string, sbody: string, q2: string) => {
                  return `style=${q1}margin:0;padding:0;border:none;box-sizing:border-box;${sbody}${q2}`;
                }
              ) + tagEnd
            );
          } else {
            return (
              tagStart +
              ' style="margin:0;padding:0;border:none;box-sizing:border-box;"' +
              tagEnd
            );
          }
        }
      );

      // bodyタグの属性やstyleを一切付与せず、選択要素のみbody直下に埋め込む
      const regionHtml = `<html>${head}<body>${cleanedRegionWithReset}</body></html>`;
      // rectがあればwidth/heightに使う
      const regionWidth =
        selectedRect && selectedRect.width && selectedRect.width > 0
          ? selectedRect.width
          : previewWidth;
      const regionHeight =
        selectedRect && selectedRect.height && selectedRect.height > 0
          ? selectedRect.height
          : 400;
      // regionHtmlが空の場合はエラー
      if (!regionHtml || regionHtml.length < 20) {
        setError("画像化用HTMLが空です");
        setTimeout(() => setError(""), 3000);
        return;
      }
      // width/heightは整数で送信
      const regionWidthInt = Math.round(regionWidth);
      const regionHeightInt = Math.round(regionHeight);
      // デバッグ用: 送信内容を一時出力
      // console.log({ html: regionHtml, width: regionWidthInt, height: regionHeightInt });
      const res = await fetch("/api/html2image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: regionHtml,
          width: regionWidthInt,
          height: regionHeightInt,
        }),
      });
      if (!res.ok) {
        setError("画像化APIでエラーが発生しました");
        setTimeout(() => setError(""), 3000);
        return;
      }
      const blob = await res.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("画像化処理でエラーが発生しました");
      setTimeout(() => setError(""), 3000);
    }
  };

  // 全体画像コピー（従来通り）
  const handleImageCopy = async () => {
    try {
      const res = await fetch("/api/html2image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, width: previewWidth, height: 400 }),
      });
      if (!res.ok) {
        setError("画像化APIでエラーが発生しました");
        setCopied(false); // エラー時は明示的にfalse
        setTimeout(() => setError(""), 3000);
        return;
      }
      const blob = await res.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob }),
      ]);
      // デバッグ用: 通知発火タイミングを出力
      console.log("setCopied(true) called (全体コピー)");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("画像化処理でエラーが発生しました");
      setCopied(false); // エラー時は明示的にfalse
      setTimeout(() => setError(""), 3000);
      // デバッグ用: エラー内容も出力
      console.error("handleImageCopy error", e);
    }
  };

  // ズーム用styleタグをsrcDocに埋め込む（枠サイズはそのまま、中身だけ拡大・縮小）
  const zoomStyle = `<style>body { transform: scale(${zoom}); transform-origin: top left; }</style>`;
  const iframeHtml = zoomStyle + html;

  // region-selectイベントを受信し、選択領域を更新
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "region-select" && e.data.outerHTML) {
        setSelectedRegion(e.data.outerHTML);
        if (
          e.data.rect &&
          typeof e.data.rect.width === "number" &&
          typeof e.data.rect.height === "number"
        ) {
          setSelectedRect({
            width: e.data.rect.width,
            height: e.data.rect.height,
          });
        } else {
          setSelectedRect(null);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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
      <div className="bg-gray-50 px-2 sm:px-6 py-4 border-b border-gray-200 min-w-0 min-h-[120px] flex items-center">
        {/* 2カラム2行グリッド: 左=スライダー/ズーム, 右=アイコン群 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 items-center w-full">
          {/* 1列目・1行目: スライダー */}
          <div className="col-start-1 row-start-1 flex justify-center items-center w-full">
            <SliderWidthControl
              width={previewWidth}
              max={paneMaxWidth}
              onChange={setPreviewWidth}
            />
          </div>
          {/* 1列目・2行目: zoom */}
          <div className="col-start-1 row-start-2 flex justify-center items-center w-full">
            <ZoomControls onZoomChange={setZoom} />
          </div>
          {/* 2列目: アイコン群（2行中央・縦並び） */}
          <div className="col-start-2 row-span-2 flex flex-col justify-center items-center h-full">
            <div className="flex flex-row justify-center items-center h-full gap-4">
              <ActionButtons
                onImageCopy={handleImageCopy}
                buttonClassName="!px-3 !py-2 !text-lg !min-w-[40px]"
                iconSize={28}
              />
              <button
                type="button"
                className="flex items-center justify-center px-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 min-w-[40px] text-lg"
                onClick={handleRegionImageCopy}
                disabled={!selectedRegion}
                aria-label="選択領域のみ画像コピー"
                title="選択領域のみ画像コピー"
              >
                <RegionCopyIcon width={28} height={28} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* プレビュー表示領域（iframeで分離表示） */}
      <PreviewIframeArea
        iframeHtml={iframeHtml}
        width={previewWidth}
        height={400}
      />
    </section>
  );
};

export default PreviewPane;
