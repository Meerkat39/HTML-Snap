// 操作ボタン群コンポーネント（画像コピーボタン含む）

interface ActionButtonsProps {
  onImageCopy: () => void;
}

const ActionButtons = ({ onImageCopy }: ActionButtonsProps) => {
  // 操作ボタンUI（画像コピーボタン追加）
  return (
    <div className="flex gap-2">
      {/* 他の操作ボタンはここに追加 */}
      <button
        type="button"
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={onImageCopy}
        aria-label="レンダリング結果を画像コピー"
      >
        画像コピー
      </button>
    </div>
  );
};

export default ActionButtons;
