import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import PreviewPane from "./PreviewPane";

describe("PreviewPane 複合操作・連続通知 結合テスト", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["dummy"], { type: "image/png" }),
    });
    Object.assign(navigator, {
      clipboard: {
        write: jest.fn().mockResolvedValue(undefined),
      },
    });
    // @ts-expect-error ClipboardItem is not defined in JSDOM, this is a test mock
    window.ClipboardItem = function (items: Record<string, Blob>) {
      return items;
    };
  });

  it("領域選択→領域コピー→全体コピー→通知が正しく切り替わる", async () => {
    jest.useFakeTimers();
    render(<PreviewPane html="<div>multi test</div>" />);

    // 領域選択イベント
    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: "region-select",
            outerHTML: '<div class="selected">multi test</div>',
            rect: { width: 120, height: 60 },
          },
        })
      );
    });

    // 領域コピー
    const regionCopyBtn = await waitFor(() =>
      screen.getByRole("button", { name: "選択領域のみ画像コピー" })
    );
    expect(regionCopyBtn).not.toBeDisabled();
    await act(async () => {
      fireEvent.click(regionCopyBtn);
    });
    // 領域コピー通知
    await waitFor(() => {
      expect(
        screen.getByText(/画像をクリップボードにコピーしました/)
      ).toBeInTheDocument();
    });

    // すぐ全体コピー
    const copyBtn = screen.getByRole("button", {
      name: "レンダリング結果を画像コピー",
    });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    // 通知が再表示される
    await waitFor(() => {
      expect(
        screen.getByText(/画像をクリップボードにコピーしました/)
      ).toBeInTheDocument();
    });

    // 2秒後に通知が消える
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/画像をクリップボードにコピーしました/)
      ).not.toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
