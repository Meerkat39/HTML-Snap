// 選択領域のみ画像コピー用アイコン
import React from "react";

const RegionCopyIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      rx="2"
      fill="#fff"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="5.5"
      y="5.5"
      width="9"
      height="9"
      rx="1"
      fill="#3b82f6"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="7.5"
      y="7.5"
      width="5"
      height="5"
      rx="0.5"
      fill="#fff"
      stroke="#3b82f6"
      strokeWidth="1.5"
    />
  </svg>
);

export default RegionCopyIcon;
