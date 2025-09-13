/**
 * usePreviewSelection: 選択領域のouterHTML・rect情報・region-selectイベント管理用カスタムフック
 *
 * @returns { selectedRegion, setSelectedRegion, selectedRect, setSelectedRect }
 */
import { useEffect, useState } from "react";

export const usePreviewSelection = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedRect, setSelectedRect] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "region-select" && e.data.outerHTML) {
        setSelectedRegion(e.data.outerHTML);
        if (
          e.data.rect &&
          typeof e.data.rect.width === "number" &&
          typeof e.data.rect.height === "number"
        ) {
          setSelectedRect({
            width: e.data.rect.width,
            height: e.data.rect.height,
          });
        } else {
          setSelectedRect(null);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return { selectedRegion, setSelectedRegion, selectedRect, setSelectedRect };
};
