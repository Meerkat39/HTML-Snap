/**
 * プレビュー表示領域（iframeで分離表示）UI専用コンポーネント
 * - ハイライトスクリプト注入・postMessage受信はカスタムフックで分離
 */
import React, { useRef } from "react";
import {
  RegionSelectMessage,
  useIframePostMessageListener,
} from "../hooks/useIframePostMessageListener";
import { useInjectHighlightScript } from "../hooks/useInjectHighlightScript";

export interface PreviewIframeAreaProps {
  iframeHtml: string;
  width: number;
  height?: number;
  /**
   * region-selectイベント受信時のコールバック（任意）
   */
  onRegionSelect?: (data: RegionSelectMessage) => void;
}

/**
 * プレビュー表示領域（iframeで分離表示）UI専用コンポーネント
 */
const PreviewIframeArea: React.FC<PreviewIframeAreaProps> = ({
  iframeHtml,
  width,
  height = 400,
  onRegionSelect,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // ハイライトスクリプト注入（カスタムフック）
  useInjectHighlightScript(iframeRef, iframeHtml);
  // postMessage受信（カスタムフック）
  useIframePostMessageListener(onRegionSelect);

  return (
    <div
      className="flex-1 min-w-0 min-h-0 p-6 bg-white flex items-stretch justify-stretch"
      style={{
        width: width + "px",
        height: height + "px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
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
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
};

export default PreviewIframeArea;
