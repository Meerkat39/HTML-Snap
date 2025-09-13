import { fireEvent, render, screen } from "@testing-library/react";
import SliderWidthControl from "../components/SliderWidthControl";

describe("SliderWidthControl", () => {
  it("初期値が正しく表示される", () => {
    render(<SliderWidthControl width={600} max={1200} onChange={() => {}} />);
    expect(screen.getByRole("slider")).toHaveValue("600");
  });

  it("スライダー操作でonChangeが呼ばれる", () => {
    const handleChange = jest.fn();
    render(
      <SliderWidthControl width={600} max={1200} onChange={handleChange} />
    );
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "800" } });
    expect(handleChange).toHaveBeenCalledWith(800);
  });
});
