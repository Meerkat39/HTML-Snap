/**
 * 入力欄ペイン（InputAreaをラップ）
 * @param value 入力値
 * @param onChange 入力イベント
 * @param onPasteSanitized サニタイズ済みHTMLペースト時コールバック
 */
import { InputPaneProps } from "../types/InputPaneProps";
import InputArea from "./InputArea";

const InputPane: React.FC<InputPaneProps> = ({
  value,
  onChange,
  onPasteSanitized,
}) => {
  return (
    <section className="flex-1 border-none flex flex-col">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700 min-h-[120px] flex flex-col justify-center">
        <span>📝 HTMLコード入力</span>
        <span className="text-xs text-gray-500 mt-1">
          貼り付け・入力で即時プレビューされます
        </span>
      </div>
      <div className="flex-1 p-6">
        {/* InputAreaにonPasteSanitizedを渡す */}
        <InputArea
          value={value}
          onChange={onChange}
          onPasteSanitized={onPasteSanitized}
        />
      </div>
    </section>
  );
};

export default InputPane;
