// InputPaneコンポーネントの単体テスト
import { render, screen } from "@testing-library/react";
import InputPane from "../components/InputPane";

describe("InputPane", () => {
  it("InputPaneがレンダリングされる", () => {
    render(<InputPane value="" onChange={() => {}} />);
    // タイトル部分のテキストでレンダリング確認
    expect(screen.getByText("📝 HTMLコード入力")).toBeInTheDocument();
  });
});
