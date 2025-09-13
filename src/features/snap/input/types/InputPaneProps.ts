/**
 * InputPaneのProps型
 * - value: 入力値
 * - onChange: 入力イベントハンドラ
 * - onPasteSanitized: サニタイズ済みHTMLペースト時コールバック（省略可）
 */
export type InputPaneProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasteSanitized?: (sanitized: string) => void;
};
