// プレビュー表示エリア: htmlをpropsで受け取り表示
type RenderAreaProps = {
  html: string;
};

const RenderArea = ({ html }: RenderAreaProps) => {
  // TODO: htmlをサニタイズしてdangerouslySetInnerHTMLで表示
  return (
    <div className="w-full h-full">RenderArea（プレビュー: 実装予定）</div>
  );
};

export default RenderArea;
