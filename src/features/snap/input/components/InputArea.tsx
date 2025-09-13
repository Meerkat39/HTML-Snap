"use client";
import React from "react";
import { useInputAreaState } from "../hooks/useInputAreaState";
import ClearButton from "./ClearButton";
import InputErrorMessage from "./InputErrorMessage";

/**
 * HTMLコード入力欄コンポーネント
 * @param value 入力値
 * @param onChange 入力値変更時のハンドラ
 * @param onPasteSanitized ペースト時サニタイズ用コールバック（任意）
 */
type InputAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasteSanitized?: (sanitized: string) => void;
};

const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onPasteSanitized,
}) => {
  // カスタムフックでロジック・状態を取得
  const { textareaRef, handleClear, handlePaste, errorMsg } = useInputAreaState(
    value,
    onChange,
    onPasteSanitized
  );

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {/* ラベル・説明・エラー */}
      <InputErrorMessage errorMsg={errorMsg} />

      {/* 入力欄＋クリアボタン */}
      <div className="relative h-full">
        <textarea
          ref={textareaRef}
          id="htmlInput"
          className="w-full h-full min-h-[180px] max-h-full p-3 border rounded-md bg-gray-50 text-sm font-mono resize-vertical focus:outline-blue-400 pr-16"
          placeholder="ここにHTMLコードを入力してください..."
          aria-label="HTMLコード入力欄"
          value={value}
          onChange={onChange}
          onPaste={handlePaste}
        />
        <ClearButton visible={!!value} onClick={handleClear} />
      </div>
    </div>
  );
};

export default InputArea;
