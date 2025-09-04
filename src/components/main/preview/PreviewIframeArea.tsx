// プレビュー表示領域（iframeで分離表示）コンポーネント
import React from "react";

interface PreviewIframeAreaProps {
  iframeHtml: string;
  width: number;
  height?: number;
}

const PreviewIframeArea: React.FC<PreviewIframeAreaProps> = ({
  iframeHtml,
  width,
  height = 400,
}) => {
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
