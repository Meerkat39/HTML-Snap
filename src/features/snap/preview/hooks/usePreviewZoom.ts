/**
 * usePreviewZoom: ズーム倍率の状態管理用カスタムフック
 *
 * @returns { zoom, setZoom }
 */
import { useState } from "react";

export const usePreviewZoom = () => {
  const [zoom, setZoom] = useState(1.0);
  return { zoom, setZoom };
};
