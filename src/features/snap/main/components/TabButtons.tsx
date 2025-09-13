import React from "react";

/**
 * タブ切替ボタン群（エディタ/両方/プレビュー）
 * @param mode 現在の表示モード
 * @param setMode モード変更関数
 */
type ViewMode = "editor" | "both" | "preview";
type TabButtonsProps = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const TabButtons: React.FC<TabButtonsProps> = ({ mode, setMode }) => (
  <div className="flex gap-2 p-2 border-b bg-gray-50">
    <button
      className={`px-4 py-2 rounded ${
        mode === "editor" ? "bg-blue-500 text-white" : "bg-white border"
      }`}
      onClick={() => setMode("editor")}
    >
      エディタ
    </button>
    <button
      className={`px-4 py-2 rounded ${
        mode === "both" ? "bg-blue-500 text-white" : "bg-white border"
      }`}
      onClick={() => setMode("both")}
    >
      両方
    </button>
    <button
      className={`px-4 py-2 rounded ${
        mode === "preview" ? "bg-blue-500 text-white" : "bg-white border"
      }`}
      onClick={() => setMode("preview")}
    >
      プレビュー
    </button>
  </div>
);

export default TabButtons;
