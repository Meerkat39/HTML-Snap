// PreviewIframeAreaコンポーネントの単体テスト
import { render, screen } from "@testing-library/react";
import PreviewIframeArea from "./PreviewIframeArea";

describe("PreviewIframeArea", () => {
  it("iframeが正しく表示され、srcDocにHTMLが渡る", () => {
    const testHtml = "<div>テストHTML</div>";
    render(
      <PreviewIframeArea iframeHtml={testHtml} width={500} height={300} />
    );
    const iframe = screen.getByTitle("HTMLプレビュー");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("srcDoc", testHtml);
    expect(iframe).toHaveStyle("width: 100%");
    expect(iframe).toHaveStyle("height: 100%");
  });
});
