import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PreviewPane from "./PreviewPane";

describe("PreviewPane 全体コピー・通知 結合テスト", () => {
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

  it("全体画像コピー→通知表示→通知が消える", async () => {
    jest.useFakeTimers();
    render(<PreviewPane html="<div>全体テスト</div>" />);

    // 全体コピー（画像コピー）ボタン取得
    const copyBtn = screen.getByRole("button", {
      name: "レンダリング結果を画像コピー",
    });
    await import("react").then(({ act }) =>
      act(() => {
        fireEvent.click(copyBtn);
      })
    );

    // 通知UIが表示されるか
    await waitFor(() => {
      expect(
        screen.getByText(/画像をクリップボードにコピーしました/)
      ).toBeInTheDocument();
    });

    // 2秒後に通知が消えるか
    await import("react").then(({ act }) =>
      act(() => {
        jest.advanceTimersByTime(2000);
      })
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/画像をクリップボードにコピーしました/)
      ).not.toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
