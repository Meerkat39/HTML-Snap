// HTML関連ユーティリティ関数群
import DOMPurify from "isomorphic-dompurify";
// sanitizeHtml: 危険タグ除去
// validateHtml: HTML構文チェック

export const sanitizeHtml = (
  html: string
): { sanitized: string; hasDanger: boolean } => {
  // DOMPurifyでサニタイズ
  const sanitized = DOMPurify.sanitize(html);
  console.log("Sanitized:", sanitized);
  // 危険タグが含まれていたかどうか（サニタイズ前後で差分があればtrue）
  const hasDanger = sanitized !== html;
  return { sanitized, hasDanger };
};

export const validateHtml = (html: string): boolean => {
  if (!html.trim()) return true;
  try {
    const doc = new window.DOMParser().parseFromString(html, "text/html");
    return !doc.body.innerHTML.includes("parsererror");
  } catch {
    return false;
  }
};
