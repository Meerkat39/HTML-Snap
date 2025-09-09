// PaneHeader: 入力・プレビュー共通の説明欄
// title: メインタイトル, description: サブ説明文

type PaneHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

const PaneHeader = ({
  title,
  description,
  className = "",
}: PaneHeaderProps) => (
  <div
    className={`bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700 min-h-[128px] flex flex-col justify-center ${className}`}
  >
    <span>{title}</span>
    {description && (
      <span className="text-xs text-gray-500 mt-1">{description}</span>
    )}
  </div>
);

export default PaneHeader;
