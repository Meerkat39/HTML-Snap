// 選択領域のみ画像コピー用アイコン
import React from "react";

interface RegionCopyIconProps {
  width?: number;
  height?: number;
}

const RegionCopyIcon: React.FC<RegionCopyIconProps> = ({
  width = 20,
  height = 20,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    {/* 外枠（白領域）をSVG外にはみ出すほど最大化 */}
    <rect
      x="-10"
      y="-10"
      width="40"
      height="40"
      rx="20"
      fill="#fff"
      stroke="#bbb"
      strokeWidth="1"
    />
    {/* 青色領域を大きく（白余白を減らす） */}
    <rect
      x="4.5"
      y="4.5"
      width="11"
      height="11"
      rx="2.5"
      fill="#3b82f6"
      stroke="#fff"
      strokeWidth="1.2"
    />
    {/* 中央の白枠も大きく */}
    <rect
      x="7.5"
      y="7.5"
      width="5"
      height="5"
      rx="1.2"
      fill="#fff"
      stroke="#3b82f6"
      strokeWidth="1.2"
    />
  </svg>
);

export default RegionCopyIcon;
