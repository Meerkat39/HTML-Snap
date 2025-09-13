/**
 * usePreviewNotifications: コピー通知・エラー通知の状態管理用カスタムフック
 *
 * @returns { copied, setCopied, error, setError }
 */
import { useState } from "react";

export const usePreviewNotifications = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  return { copied, setCopied, error, setError };
};
