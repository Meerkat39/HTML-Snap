// プレビューペイン（RenderArea＋ActionButtonsをラップ）
import ActionButtons from "../common/ActionButtons";
import RenderArea from "../render/RenderArea";

type PreviewPaneProps = {
  html: string;
};

const PreviewPane = ({ html }: PreviewPaneProps) => {
  return (
    <section className="flex-1 flex flex-col">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <span>🖼️ プレビュー</span>
        <div>
          <ActionButtons />
        </div>
      </div>
      <div className="flex-1 p-6 flex items-center justify-center bg-white">
        <RenderArea html={html} />
      </div>
    </section>
  );
};

export default PreviewPane;
