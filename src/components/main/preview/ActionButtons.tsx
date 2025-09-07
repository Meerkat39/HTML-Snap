// 操作ボタン群コンポーネント（画像コピーボタン含む）
import CopyImageIcon from "../../icons/CopyImageIcon";


interface ActionButtonsProps {
  onImageCopy: () => void;
}

const ActionButtons = ({ onImageCopy }: ActionButtonsProps) => {
  // 操作ボタンUI（画像コピーボタン追加・アイコン化）
  return (
    <div className="flex gap-2 items-center">
      {/* 画像コピー（アイコン＋ラベル、狭い時はラベル非表示も可） */}
      <button
        type="button"
        className="flex items-center justify-center px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 min-w-[36px]"
        onClick={onImageCopy}
        aria-label="レンダリング結果を画像コピー"
        title="画像コピー"
      >
        <CopyImageIcon />
      </button>
      {/* 他の操作ボタンも同様にアイコン化推奨 */}
    </div>
  );
};

export default ActionButtons;
