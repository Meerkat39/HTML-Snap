/**
 * useIframePostMessageListener: iframeからのpostMessage受信ロジックを提供するカスタムフック
 *
 * @param onRegionSelect region-selectイベント受信時のコールバック
 */
import { useEffect } from "react";

/**
 * region-selectイベントのメッセージ型
 */
export type RegionSelectMessage = {
  type: "region-select";
  regionId: string;
  [key: string]: unknown;
};

/**
 * iframeからのpostMessage受信ロジックを提供するカスタムフック
 * @param onRegionSelect region-selectイベント受信時のコールバック
 */
export const useIframePostMessageListener = (
  onRegionSelect?: (data: RegionSelectMessage) => void
) => {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // 型ガード: region-selectイベントのみ処理
      if (
        typeof e.data === "object" &&
        e.data !== null &&
        (e.data as { type?: string }).type === "region-select"
      ) {
        if (onRegionSelect) onRegionSelect(e.data as RegionSelectMessage);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onRegionSelect]);
};
