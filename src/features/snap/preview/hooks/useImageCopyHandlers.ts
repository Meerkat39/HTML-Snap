/**
 * useImageCopyHandlers: 画像コピー系ハンドラを提供するカスタムフック
 *
 * @param html プレビューHTML
 * @param previewWidth プレビュー幅
 * @param selectedRegion 選択領域HTML
 * @param selectedRect 選択領域rect
 * @param setCopied 通知setter
 * @param setError エラー通知setter
 * @returns { handleImageCopy, handleRegionImageCopy }
 */
export const useImageCopyHandlers = (
  html: string,
  previewWidth: number,
  selectedRegion: string | null,
  selectedRect: { width: number; height: number } | null,
  setCopied: (v: boolean) => void,
  setError: (v: string) => void
) => {
  // 全体画像コピー
  const handleImageCopy = async () => {
    try {
      const res = await fetch("/api/html2image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, width: previewWidth, height: 400 }),
      });
      if (!res.ok) {
        setError("画像化APIでエラーが発生しました");
        setCopied(false);
        setTimeout(() => setError(""), 3000);
        return;
      }
      const blob = await res.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("画像化処理でエラーが発生しました");
      setCopied(false);
      setTimeout(() => setError(""), 3000);
    }
  };

  // 選択領域の画像コピー
  const handleRegionImageCopy = async () => {
    if (!selectedRegion) return;
    try {
      const headMatch = html.match(/<head[\s\S]*?>[\s\S]*?<\/head>/i);
      let head = headMatch ? headMatch[0] : "";
      head = head.replace(
        /(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/gi,
        (match, p1, p2, p3) => {
          const newCss = p2.replace(
            /body\s*\{[^}]*\}/gi,
            (bodyBlock: string) => {
              const cleaned = bodyBlock.replace(
                /background(-color)?\s*:[^;]+;?/gi,
                ""
              );
              return cleaned;
            }
          );
          const noHighlight = newCss.replace(
            /\.html-snap-region-highlight\s*\{[^}]*\}/gi,
            ""
          );
          return p1 + noHighlight + p3;
        }
      );
      const resetCss = `<style>html,body{margin:0!important;padding:0!important;border:none!important;box-sizing:border-box!important;}</style>`;
      head = head.replace(/<\/head>/i, resetCss + "</head>");
      const cleanedRegion = selectedRegion
        .replace(
          /\s*class=("|')([^"']*\bhtml-snap-region-highlight\b[^"']*)("|')/gi,
          (m, q1, classes, q2) => {
            const filtered = (classes as string)
              .split(/\s+/)
              .filter((c: string) => c !== "html-snap-region-highlight")
              .join(" ");
            return filtered ? ` class=${q1}${filtered}${q2}` : "";
          }
        )
        .replace(/style=("|')([^"']*)("|')/gi, (m, q1, styleStr, q2) => {
          const filtered = (styleStr as string)
            .split(";")
            .map((s: string) => s.trim())
            .filter(
              (s: string) =>
                s &&
                !/^(outline|box-shadow|margin|padding|background(-color)?)/i.test(
                  s
                )
            )
            .join("; ");
          return filtered ? ` style=${q1}${filtered}${q2}` : "";
        });
      const cleanedRegionWithReset = cleanedRegion.replace(
        /^(<[^>]+)(>)/,
        (m: string, tagStart: string, tagEnd: string) => {
          if (/style=/.test(tagStart)) {
            return (
              tagStart.replace(
                /style=("|')([^"']*)("|')/,
                (sm: string, q1: string, sbody: string, q2: string) => {
                  return `style=${q1}margin:0;padding:0;border:none;box-sizing:border-box;${sbody}${q2}`;
                }
              ) + tagEnd
            );
          } else {
            return (
              tagStart +
              ' style="margin:0;padding:0;border:none;box-sizing:border-box;"' +
              tagEnd
            );
          }
        }
      );
      const regionHtml = `<html>${head}<body>${cleanedRegionWithReset}</body></html>`;
      const regionWidth =
        selectedRect && selectedRect.width && selectedRect.width > 0
          ? selectedRect.width
          : previewWidth;
      const regionHeight =
        selectedRect && selectedRect.height && selectedRect.height > 0
          ? selectedRect.height
          : 400;
      if (!regionHtml || regionHtml.length < 20) {
        setError("画像化用HTMLが空です");
        setTimeout(() => setError(""), 3000);
        return;
      }
      const regionWidthInt = Math.round(regionWidth);
      const regionHeightInt = Math.round(regionHeight);
      const res = await fetch("/api/html2image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: regionHtml,
          width: regionWidthInt,
          height: regionHeightInt,
        }),
      });
      if (!res.ok) {
        setError("画像化APIでエラーが発生しました");
        setTimeout(() => setError(""), 3000);
        return;
      }
      const blob = await res.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("画像化処理でエラーが発生しました");
      setTimeout(() => setError(""), 3000);
    }
  };

  return { handleImageCopy, handleRegionImageCopy };
};
