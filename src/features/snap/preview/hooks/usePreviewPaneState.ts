/**
 * usePreviewPaneState: PreviewPaneのロジック（状態管理・ハンドラ）を集約するカスタムフック
 *
 * @param html プレビュー表示用HTML
 * @returns PreviewPaneで必要な状態・ハンドラ・ref・計算値
 */

import { useImageCopyHandlers } from "./useImageCopyHandlers";
import { usePreviewNotifications } from "./usePreviewNotifications";
import { usePreviewSelection } from "./usePreviewSelection";
import { usePreviewWidth } from "./usePreviewWidth";
import { usePreviewZoom } from "./usePreviewZoom";

export const usePreviewPaneState = (html: string) => {
  // 各機能ごとのカスタムフックを呼び出し
  const { previewWidth, setPreviewWidth, paneMaxWidth, paneRef } =
    usePreviewWidth();
  const { zoom, setZoom } = usePreviewZoom();
  const { selectedRegion, setSelectedRegion, selectedRect, setSelectedRect } =
    usePreviewSelection();
  const { copied, setCopied, error, setError } = usePreviewNotifications();
  const { handleImageCopy, handleRegionImageCopy } = useImageCopyHandlers(
    html,
    previewWidth,
    selectedRegion,
    selectedRect,
    setCopied,
    setError
  );

  // ズーム用styleタグをsrcDocに埋め込む（枠サイズはそのまま、中身だけ拡大・縮小）
  const zoomStyle = `<style>body { transform: scale(${zoom}); transform-origin: top left; }</style>`;
  const iframeHtml = zoomStyle + html;

  return {
    previewWidth,
    setPreviewWidth,
    paneMaxWidth,
    paneRef,
    copied,
    setCopied,
    error,
    setError,
    zoom,
    setZoom,
    selectedRegion,
    setSelectedRegion,
    selectedRect,
    setSelectedRect,
    handleRegionImageCopy,
    handleImageCopy,
    iframeHtml,
  };
};
