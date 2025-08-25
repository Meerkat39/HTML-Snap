// 入力欄のエラー表示専用コンポーネント
// errorMsg: エラーメッセージ（空文字なら非表示）

type InputErrorMessageProps = {
  errorMsg: string;
};

const InputErrorMessage = ({ errorMsg }: InputErrorMessageProps) => {
  if (!errorMsg) return null;
  return (
    <div className="mt-2 text-sm text-red-600 border border-red-200 bg-red-50 rounded p-2">
      {errorMsg}
    </div>
  );
};

export default InputErrorMessage;
