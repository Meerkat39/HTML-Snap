"use client";
import React, { useMemo, useRef } from "react";
import { sanitizeHtml, validateHtml } from "../utils/html";
import ClearButton from "./ClearButton";
import InputErrorMessage from "./InputErrorMessage";

// HTMLコード入力欄のprops定義
// value: 入力値
// onChange: 入力値変更時のハンドラ
// onPasteSanitized: ペースト時サニタイズ用コールバック（任意）
type InputAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasteSanitized?: (sanitized: string) => void;
};

const InputArea = ({ value, onChange, onPasteSanitized }: InputAreaProps) => {
  // 入力欄のDOM参照（クリア・フォーカス用）
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 入力値クリア＆フォーカス復帰
  const handleClear = () => {
    const event = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
    textareaRef.current?.focus();
  };

  // サニタイズ・バリデーション判定（useMemoで最適化）
  const { hasDanger } = useMemo(() => sanitizeHtml(value), [value]);
  const isValid = useMemo(() => validateHtml(value), [value]);

  // ペースト時サニタイズ（危険タグ除去時のみ親に通知）
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    const { sanitized } = sanitizeHtml(pasted);
    if (sanitized !== pasted && onPasteSanitized) {
      e.preventDefault();
      onPasteSanitized(sanitized);
    }
    // 通常はそのまま貼り付け
  };

  // エラーメッセージ生成
  const errorMsg = hasDanger
    ? "危険なタグ（script, iframe等）が含まれています。安全のため除去されます。"
    : !isValid
    ? "HTML構文に誤りがあります（タグ閉じ忘れ等）。"
    : "";

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {/* ラベル・説明・エラー */}
      <label htmlFor="htmlInput" className="font-semibold text-gray-700">
        HTMLコード
      </label>
      <span className="text-sm text-gray-500 mb-1">
        貼り付け・入力で即時プレビューされます
      </span>
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
