/**
 * usePreviewWidth: プレビュー枠の横幅・最大幅・refを管理するカスタムフック
 *
 * @returns { previewWidth, setPreviewWidth, paneMaxWidth, paneRef }
 */
import { useEffect, useRef, useState } from "react";

export const usePreviewWidth = () => {
  const [previewWidth, setPreviewWidth] = useState(600);
  const [paneMaxWidth, setPaneMaxWidth] = useState(1200);
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      const width = paneRef.current?.offsetWidth;
      if (width) {
        setPaneMaxWidth(width);
        setPreviewWidth((w) => Math.min(w, width));
      }
    };
    updateWidth();
    if (paneRef.current) {
      const observer = new window.ResizeObserver(updateWidth);
      observer.observe(paneRef.current);
      return () => observer.disconnect();
    }
    return;
  }, []);

  return { previewWidth, setPreviewWidth, paneMaxWidth, paneRef };
};
