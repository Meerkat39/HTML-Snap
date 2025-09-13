import React from "react";

/**
 * プレビュー用の通知表示（コピー完了・エラー）
 * @param copied コピー完了フラグ
 * @param error エラーメッセージ
 */
type PreviewNotificationsProps = {
  copied: boolean;
  error: string;
};

const PreviewNotifications: React.FC<PreviewNotificationsProps> = ({
  copied,
  error,
}) => (
  <>
    {copied && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
        画像をクリップボードにコピーしました
      </div>
    )}
    {error && (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
        {error}
      </div>
    )}
  </>
);

export default PreviewNotifications;
