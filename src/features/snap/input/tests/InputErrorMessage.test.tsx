// InputErrorMessageコンポーネントの単体テスト
import { render, screen } from "@testing-library/react";
import InputErrorMessage from "../components/InputErrorMessage";

describe("InputErrorMessage", () => {
  it("エラーメッセージが表示される", () => {
    render(<InputErrorMessage errorMsg="エラーです" />);
    expect(screen.getByText("エラーです")).toBeInTheDocument();
  });

  it("errorMsgが空文字なら何も表示されない", () => {
    const { container } = render(<InputErrorMessage errorMsg="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
