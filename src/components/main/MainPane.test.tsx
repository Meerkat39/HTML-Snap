// MainPaneの表示モード切替テスト
import { fireEvent, render, screen } from "@testing-library/react";
import MainPane from "./MainPane";

describe("MainPane 表示モード切替UI", () => {
  const inputValue = "<h1>テストHTML</h1>";
  const onInputChange = jest.fn();
  const onPasteSanitized = jest.fn();

  test("初期状態は両方表示", () => {
    render(
      <MainPane
        inputValue={inputValue}
        onInputChange={onInputChange}
        onPasteSanitized={onPasteSanitized}
      />
    );
    expect(screen.getByText("📝 HTMLコード入力")).toBeInTheDocument();
  });

  test("エディタタブで入力欄のみ表示", () => {
    render(
      <MainPane
        inputValue={inputValue}
        onInputChange={onInputChange}
        onPasteSanitized={onPasteSanitized}
      />
    );
    fireEvent.click(screen.getByText("エディタ"));
    expect(screen.getByText("📝 HTMLコード入力")).toBeInTheDocument();
  });

  test("プレビュタブでプレビューのみ表示", () => {
    render(
      <MainPane
        inputValue={inputValue}
        onInputChange={onInputChange}
        onPasteSanitized={onPasteSanitized}
      />
    );
    fireEvent.click(screen.getByText("プレビュー"));
    expect(screen.queryByText("📝 HTMLコード入力")).toBeNull();
  });
});
