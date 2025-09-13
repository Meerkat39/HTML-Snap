// プレビュー表示エリア: htmlをpropsで受け取り表示
// サニタイズして安全に描画する
import { sanitizeHtml } from "../../utils/html";

type RenderAreaProps = {
  html: string;
};

const RenderArea = ({ html }: RenderAreaProps) => {
  console.log("html:", html);
  // 入力HTMLをサニタイズ
  const { sanitized } = sanitizeHtml(html);

  return (
    <>
      <div className="w-full h-full prose">
        {/* サニタイズ済みHTMLを安全に表示 */}
        <div dangerouslySetInnerHTML={{ __html: sanitized }} />
      </div>
    </>
  );
};

export default RenderArea;
