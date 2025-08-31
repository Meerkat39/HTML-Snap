// ズーム操作UIコンポーネント
// - プレビュー領域の拡大・縮小・リセット操作を提供
// - ズーム倍率の状態管理も内包
// - 親からonZoomChangeで倍率値を通知
import React, { useState } from "react";

/**
 * ZoomControlsProps
 * @param onZoomChange ズーム倍率変更時に親へ通知するコールバック
 */
export type ZoomControlsProps = {
  onZoomChange: (zoom: number) => void;
};

// ズーム倍率の最小・最大・ステップ値
const minZoom = 0.5;
const maxZoom = 2.0;
const step = 0.1;

/**
 * ZoomControls
 * プレビュー領域のズーム操作UI（＋/−/リセット/倍率表示）
 * - 内部でzoom状態を管理
 * - 各操作時にonZoomChangeで親へ通知
 */
const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomChange }) => {
  // ズーム倍率の状態（初期値100%）
  const [zoom, setZoom] = useState(1.0);

  // ズームイン（＋ボタン）
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + step, maxZoom);
    setZoom(newZoom);
    onZoomChange(newZoom);
  };
  // ズームアウト（−ボタン）
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - step, minZoom);
    setZoom(newZoom);
    onZoomChange(newZoom);
  };
  // ズームリセット（⟳ボタン）
  const handleZoomReset = () => {
    setZoom(1.0);
    onZoomChange(1.0);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* ズームアウトボタン */}
      <button
        className="px-2 py-1 border rounded bg-white"
        title="ズームアウト"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
      >
        −
      </button>
      {/* 現在のズーム倍率表示 */}
      <span className="px-2">{Math.round(zoom * 100)}%</span>
      {/* ズームインボタン */}
      <button
        className="px-2 py-1 border rounded bg-white"
        title="ズームイン"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
      >
        ＋
      </button>
      {/* ズームリセットボタン */}
      <button
        className="px-2 py-1 border rounded bg-white"
        title="リセット"
        onClick={handleZoomReset}
        disabled={zoom === 1.0}
      >
        ⟳
      </button>
    </div>
  );
};

export default ZoomControls;
