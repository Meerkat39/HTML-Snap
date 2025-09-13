import { useState } from "react";
import { ViewMode } from "../types/viewMode";

/**
 * MainPaneの状態管理・ロジックを集約するカスタムフック
 *
 * @returns {Object} MainPaneの状態・ハンドラ群
 * @returns {ViewMode} return.mode 表示モード
 * @returns {(mode: ViewMode) => void} return.setMode モード変更関数
 * @returns {string} return.inputValue 入力値
 * @returns {(value: string) => void} return.setInputValue 入力値変更関数
 * @returns {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} return.handleInputChange 入力イベントハンドラ
 * @returns {(sanitized: string) => void} return.handlePasteSanitized ペースト時サニタイズ用コールバック
 */
export const useMainPaneState = () => {
  // 表示モード状態
  const [mode, setMode] = useState<ViewMode>("both");
  // 入力値の状態管理
  const [inputValue, setInputValue] = useState("");

  // 入力イベントハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  // ペースト時サニタイズ用コールバック
  const handlePasteSanitized = (sanitized: string) => {
    setInputValue(sanitized);
  };

  return {
    mode,
    setMode,
    inputValue,
    setInputValue,
    handleInputChange,
    handlePasteSanitized,
  };
};
