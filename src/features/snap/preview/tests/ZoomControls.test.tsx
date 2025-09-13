// ZoomControlsコンポーネントのテスト（正常系・異常系・境界値）
// ズームボタンのクリックで倍率が変化し、リセット・表示も正しく動作するかを検証
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ZoomControls from "./ZoomControls";

// テスト用ラッパー（onZoomChangeで倍率変更を受け取る）
const Wrapper = () => <ZoomControls onZoomChange={() => {}} />;

describe("ZoomControls", () => {
  test("初期倍率が100%で表示される", () => {
    render(<Wrapper />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  test("＋ボタンで倍率が増加する", () => {
    render(<Wrapper />);
    const plusBtn = screen.getByTitle("ズームイン");
    fireEvent.click(plusBtn);
    expect(screen.getByText(/110%/)).toBeInTheDocument();
  });

  test("−ボタンで倍率が減少する", () => {
    render(<Wrapper />);
    const minusBtn = screen.getByTitle("ズームアウト");
    fireEvent.click(minusBtn);
    expect(screen.getByText(/90%/)).toBeInTheDocument();
  });

  test("リセットボタンで倍率が100%に戻る", () => {
    render(<Wrapper />);
    const plusBtn = screen.getByTitle("ズームイン");
    fireEvent.click(plusBtn);
    const resetBtn = screen.getByTitle("リセット");
    fireEvent.click(resetBtn);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  test("倍率の下限（50%）を下回らない", () => {
    render(<Wrapper />);
    const minusBtn = screen.getByTitle("ズームアウト");
    for (let i = 0; i < 10; i++) fireEvent.click(minusBtn);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  test("倍率の上限（200%）を超えない", () => {
    render(<Wrapper />);
    const plusBtn = screen.getByTitle("ズームイン");
    for (let i = 0; i < 15; i++) fireEvent.click(plusBtn);
    expect(screen.getByText(/200%/)).toBeInTheDocument();
  });
});
