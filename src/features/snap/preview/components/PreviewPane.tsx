import type { JSX } from "react";
import { usePreviewPaneState } from "../hooks/usePreviewPaneState";
import PreviewIframeArea from "./PreviewIframeArea";
import PreviewNotifications from "./PreviewNotifications";
import PreviewPaneHeader from "./PreviewPaneHeader";

type PreviewPaneProps = {
  html: string;
};

/**
 * プレビュー全体のUI・操作パネルをまとめる関数コンポーネント
 *
 * @param {object} props - コンポーネントのprops
 * @param {string} props.html - プレビュー表示対象のHTML文字列
 * @returns {JSX.Element} プレビューUI
 *
 * - 幅・ズーム・画像コピー・領域選択などの状態管理はusePreviewPaneStateで一元化
 * - PreviewNotifications, PreviewPaneHeader, PreviewIframeAreaでUI分割
 */
const PreviewPane = ({ html }: PreviewPaneProps): JSX.Element => {
  const {
    previewWidth,
    setPreviewWidth,
    paneMaxWidth,
    paneRef,
    copied,
    error,
    setZoom,
    handleImageCopy,
    handleRegionImageCopy,
    selectedRegion,
    iframeHtml,
  } = usePreviewPaneState(html);

  return (
    <section className="flex-1 flex flex-col relative h-full" ref={paneRef}>
      <PreviewNotifications copied={copied} error={error} />
      <PreviewPaneHeader
        previewWidth={previewWidth}
        paneMaxWidth={paneMaxWidth}
        setPreviewWidth={setPreviewWidth}
        setZoom={setZoom}
        onImageCopy={handleImageCopy}
        onRegionImageCopy={handleRegionImageCopy}
        selectedRegion={selectedRegion}
      />
      <PreviewIframeArea
        iframeHtml={iframeHtml}
        width={previewWidth}
        height={400}
      />
    </section>
  );
};

export default PreviewPane;
