import React from "react";
import RegionCopyIcon from "./RegionCopyIcon";

/**
 * 選択領域のみ画像コピー用ボタン
 * @param onClick クリック時のハンドラ
 * @param disabled ボタン無効化
 */
const RegionCopyButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <button
    type="button"
    className="flex items-center justify-center px-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 min-w-[40px] text-lg"
    onClick={onClick}
    disabled={disabled}
    aria-label="選択領域のみ画像コピー"
    title="選択領域のみ画像コピー"
  >
    <RegionCopyIcon width={28} height={28} />
  </button>
);

export default RegionCopyButton;
