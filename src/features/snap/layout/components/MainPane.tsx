// 表示モード切替UIの骨組み（タブ＋状態管理）
import { useState } from "react";
import InputPane from "../../input/components/InputPane";
import PreviewPane from "../../preview/components/PreviewPane";

type ViewMode = "editor" | "both" | "preview";

type MainPaneProps = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasteSanitized: (sanitized: string) => void;
};

const MainPane: React.FC<MainPaneProps> = ({
  inputValue,
  onInputChange,
  onPasteSanitized,
}) => {
  // 表示モード状態
  const [mode, setMode] = useState<ViewMode>("both");

  return (
    <div className="w-full h-full flex flex-col">
      {/* タブボタン */}
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          className={`px-4 py-2 rounded ${
            mode === "editor" ? "bg-blue-500 text-white" : "bg-white border"
          }`}
          onClick={() => setMode("editor")}
        >
          エディタ
        </button>
        <button
          className={`px-4 py-2 rounded ${
            mode === "both" ? "bg-blue-500 text-white" : "bg-white border"
          }`}
          onClick={() => setMode("both")}
        >
          両方
        </button>
        <button
          className={`px-4 py-2 rounded ${
            mode === "preview" ? "bg-blue-500 text-white" : "bg-white border"
          }`}
          onClick={() => setMode("preview")}
        >
          プレビュー
        </button>
      </div>
      {/* 表示モードごとにペイン分岐 */}
      <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
        {mode === "editor" && (
          <InputPane
            value={inputValue}
            onChange={onInputChange}
            onPasteSanitized={onPasteSanitized}
          />
        )}
        {mode === "preview" && <PreviewPane html={inputValue} />}
        {mode === "both" && (
          <>
            {/* 入力ペイン: 横並び比率1:1のためflex-1/min-w-0でラップ */}
            <div className="flex-1 min-w-0">
              <InputPane
                value={inputValue}
                onChange={onInputChange}
                onPasteSanitized={onPasteSanitized}
              />
            </div>
            {/* 区切り線: 両ペインの間に縦線を表示 */}
            <div className="w-px bg-gray-300 mx-2 self-stretch" />
            {/* プレビューペイン: 横並び比率1:1のためflex-1/min-w-0でラップ */}
            <div className="flex-1 min-w-0">
              <PreviewPane html={inputValue} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainPane;
