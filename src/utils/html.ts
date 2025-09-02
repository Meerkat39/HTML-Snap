// HTML関連ユーティリティ関数群
// import DOMPurify from "isomorphic-dompurify";
// sanitizeHtml: 危険タグ除去
// validateHtml: HTML構文チェック

export const sanitizeHtml = (
  html: string
): { sanitized: string; hasDanger: boolean } => {
  // scriptタグのみ除去、styleタグ・属性はそのまま残す
  const scriptTagRegex = /<\s*script\b[^>]*>([\s\S]*?)<\s*\/\s*script>/gi;
  const hasDanger = scriptTagRegex.test(html);
  const sanitized = html.replace(scriptTagRegex, "");
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
