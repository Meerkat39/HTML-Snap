// HTML関連ユーティリティ関数群
// sanitizeHtml: 危険タグ除去
// validateHtml: HTML構文チェック

export const sanitizeHtml = (
  html: string
): { sanitized: string; hasDanger: boolean } => {
  const dangerTags =
    /<(script|iframe|object|embed|style|link|meta)[\s\S]*?>[\s\S]*?<\/\1>|<(script|iframe|object|embed|style|link|meta)[^>]*\/>/gi;
  const hasDanger = dangerTags.test(html);
  const sanitized = html.replace(dangerTags, "");
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
