// useInputAreaState: InputAreaのロジック（状態管理・ハンドラ）を集約するカスタムフック
// 必ず日本語コメントを付与
import { useEffect, useRef, useState } from "react";
import { sanitizeHtml, validateHtml } from "../../../../utils/html";

/**
 * InputAreaの状態管理・ロジックを集約するカスタムフック
 *
 * @param {string} value 入力値
 * @param {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} onChange 入力イベントハンドラ
 * @param {(sanitized: string) => void} [onPasteSanitized] サニタイズ済みHTMLペースト時コールバック（省略可）
 * @returns {Object} 入力欄refやバリデーション状態・各種ハンドラ
 * @returns {React.RefObject<HTMLTextAreaElement>} return.textareaRef 入力欄ref
 * @returns {() => void} return.handleClear 入力値クリア&フォーカス復帰
 * @returns {boolean} return.hasDanger 危険タグ検出フラグ
 * @returns {boolean} return.isValid HTMLバリデーション結果
 * @returns {(e: React.ClipboardEvent<HTMLTextAreaElement>) => void} return.handlePaste ペースト時サニタイズハンドラ
 * @returns {string} return.errorMsg エラーメッセージ
 */
export const useInputAreaState = (
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onPasteSanitized?: (sanitized: string) => void
) => {
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

  // サニタイズ・バリデーション結果をuseStateで管理
  const [hasDanger, setHasDanger] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // value変更時にクライアント側のみ判定
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasDanger(sanitizeHtml(value).hasDanger);
      setIsValid(validateHtml(value));
    }
  }, [value]);

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

  return {
    textareaRef,
    handleClear,
    hasDanger,
    isValid,
    handlePaste,
    errorMsg,
  };
};
