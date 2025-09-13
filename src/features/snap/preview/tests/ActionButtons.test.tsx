// ActionButtonsコンポーネントの単体テスト
import { fireEvent, render, screen } from "@testing-library/react";
import ActionButtons from "../components/ActionButtons";

describe("ActionButtons", () => {
  it("画像コピーボタンが表示され、クリックでonImageCopyが呼ばれる", () => {
    const handleCopy = jest.fn();
    render(<ActionButtons onImageCopy={handleCopy} />);
    const copyBtn = screen.getByRole("button", { name: /画像コピー/i });
    fireEvent.click(copyBtn);
    expect(handleCopy).toHaveBeenCalled();
  });
});
