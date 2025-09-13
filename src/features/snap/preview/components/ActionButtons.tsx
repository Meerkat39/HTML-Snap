// 操作ボタン群コンポーネント（画像コピーボタン含む）
import CopyImageIcon from "./CopyImageIcon";

interface ActionButtonsProps {
  onImageCopy: () => void;
  buttonClassName?: string;
  iconSize?: number;
}

const ActionButtons = ({
  onImageCopy,
  buttonClassName = "",
  iconSize = 20,
}: ActionButtonsProps) => {
  // 操作ボタンUI（画像コピーボタン追加・アイコン化）
  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        className={`flex items-center justify-center px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 min-w-[36px] ${buttonClassName}`}
        onClick={onImageCopy}
        aria-label="レンダリング結果を画像コピー"
        title="画像コピー"
        style={{ fontSize: iconSize }}
      >
        <CopyImageIcon width={iconSize} height={iconSize} />
      </button>
    </div>
  );
};

export default ActionButtons;
