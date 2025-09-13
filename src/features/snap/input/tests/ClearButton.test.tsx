// ClearButtonコンポーネントの単体テスト
import { fireEvent, render, screen } from "@testing-library/react";
import ClearButton from "../components/ClearButton";

describe("ClearButton", () => {
  it("クリアボタンが表示され、クリックでonClickが呼ばれる", () => {
    const handleClick = jest.fn();
    render(<ClearButton visible={true} onClick={handleClick} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalled();
  });

  it("visible=falseならボタンが表示されない", () => {
    render(<ClearButton visible={false} onClick={() => {}} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
