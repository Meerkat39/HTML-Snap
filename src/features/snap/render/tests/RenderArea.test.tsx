import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RenderArea from "./RenderArea";

// RenderAreaの単体テスト
// - サニタイズ済みHTMLの表示
// - 危険タグ除去
// - 通常タグの正しい描画

describe("RenderArea", () => {
  it("安全なHTMLタグが正しく描画される", () => {
    render(<RenderArea html="<h1>見出し</h1><p>段落</p>" />);
    expect(screen.getByText("見出し")).toBeInTheDocument();
    expect(screen.getByText("段落")).toBeInTheDocument();
  });

  it("危険タグが除去される", () => {
    render(<RenderArea html="<script>alert('x')</script><div>ok</div>" />);
    expect(screen.getByText("ok")).toBeInTheDocument();
    // scriptタグは除去されるので、alertは表示されない
    expect(screen.queryByText("alert('x')")).not.toBeInTheDocument();
  });

  it("複雑なHTMLでも正しく描画される", () => {
    render(<RenderArea html={`<ul><li>リスト1</li><li>リスト2</li></ul>`} />);
    expect(screen.getByText("リスト1")).toBeInTheDocument();
    expect(screen.getByText("リスト2")).toBeInTheDocument();
  });
});
