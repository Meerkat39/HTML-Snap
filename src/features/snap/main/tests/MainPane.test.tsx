// MainPaneの表示モード切替テスト
import { fireEvent, render, screen } from "@testing-library/react";
import MainPane from "../components/MainPane";

describe("MainPane 表示モード切替UI", () => {
  test("初期状態は両方表示", () => {
    render(<MainPane />);
    expect(screen.getByText("📝 HTMLコード入力")).toBeInTheDocument();
  });

  test("エディタタブで入力欄のみ表示", () => {
    render(<MainPane />);
    fireEvent.click(screen.getByText("エディタ"));
    expect(screen.getByText("📝 HTMLコード入力")).toBeInTheDocument();
  });

  test("プレビュタブでプレビューのみ表示", () => {
    render(<MainPane />);
    fireEvent.click(screen.getByText("プレビュー"));
    expect(screen.queryByText("📝 HTMLコード入力")).toBeNull();
  });
});
