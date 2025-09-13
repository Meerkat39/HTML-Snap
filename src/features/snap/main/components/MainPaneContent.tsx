import React from "react";
import InputPane from "../../input/components/InputPane";
import PreviewPane from "../../preview/components/PreviewPane";
import { ViewMode } from "../types/viewMode";

/**
 * MainPaneContent: 表示モードごとのUI分岐を担う純粋UIコンポーネント
 * @param mode 表示モード（editor|both|preview）
 * @param inputValue 入力値
 * @param handleInputChange 入力イベントハンドラ
 * @param handlePasteSanitized ペースト時サニタイズ用コールバック
 */
type Props = {
  mode: ViewMode;
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handlePasteSanitized: (sanitized: string) => void;
};

export const MainPaneContent: React.FC<Props> = ({
  mode,
  inputValue,
  handleInputChange,
  handlePasteSanitized,
}) => {
  if (mode === "editor") {
    return (
      <InputPane
        value={inputValue}
        onChange={handleInputChange}
        onPasteSanitized={handlePasteSanitized}
      />
    );
  }
  if (mode === "preview") {
    return <PreviewPane html={inputValue} />;
  }
  if (mode === "both") {
    return (
      <>
        {/* 入力ペイン: 横並び比率1:1のためflex-1/min-w-0でラップ */}
        <div className="flex-1 min-w-0">
          <InputPane
            value={inputValue}
            onChange={handleInputChange}
            onPasteSanitized={handlePasteSanitized}
          />
        </div>
        {/* 区切り線: 両ペインの間に縦線を表示 */}
        <div className="w-px bg-gray-300 mx-2 self-stretch" />
        {/* プレビューペイン: 横並び比率1:1のためflex-1/min-w-0でラップ */}
        <div className="flex-1 min-w-0">
          <PreviewPane html={inputValue} />
        </div>
      </>
    );
  }
  return null;
};
