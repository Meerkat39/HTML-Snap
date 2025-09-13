import { useMainPaneState } from "../hooks/useMainPaneState";
import { MainPaneContent } from "./MainPaneContent";
import TabButtons from "./TabButtons";

/**
 * MainPane: 表示モード切替・入力/プレビューUIの親コンポーネント
 * - useMainPaneStateで状態・ロジックを集約
 * - TabButtons/Contentを切り替え表示
 */
const MainPane: React.FC = () => {
  // カスタムフックでロジック・状態を取得
  const { mode, setMode, inputValue, handleInputChange, handlePasteSanitized } =
    useMainPaneState();

  return (
    <div className="w-full h-full flex flex-col">
      {/* タブボタン */}
      <TabButtons mode={mode} setMode={setMode} />
      {/* 表示モードごとにペイン分岐 */}
      <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
        <MainPaneContent
          mode={mode}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handlePasteSanitized={handlePasteSanitized}
        />
      </div>
    </div>
  );
};

export default MainPane;
