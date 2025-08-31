// 入力欄ペイン（InputAreaをラップ）
import InputArea from "./InputArea";

// props: 入力値・onChange・ペースト時サニタイズ用コールバック
/**
 * InputPane: 入力欄ペイン
 * @param value 入力値
 * @param onChange 入力イベント
 * @param onPasteSanitized サニタイズ済みHTMLペースト時コールバック
 */
type InputPaneProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasteSanitized?: (sanitized: string) => void;
};

const InputPane = ({ value, onChange, onPasteSanitized }: InputPaneProps) => {
  return (
    <section className="flex-1 border-b-2 md:border-b-0 md:border-r-2 border-gray-200 flex flex-col">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
        📝 HTMLコード入力
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
