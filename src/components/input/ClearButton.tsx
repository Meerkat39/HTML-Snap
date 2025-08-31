// 入力欄のクリアボタン専用コンポーネント
// visible: 表示するかどうか
// onClick: クリア処理

interface ClearButtonProps {
  visible: boolean;
  onClick: () => void;
}

const ClearButton = ({ visible, onClick }: ClearButtonProps) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 focus:outline-blue-400"
      onClick={onClick}
      aria-label="入力内容をクリア"
    >
      クリア
    </button>
  );
};

export default ClearButton;
