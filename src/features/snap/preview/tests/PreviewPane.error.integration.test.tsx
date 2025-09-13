import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import PreviewPane from "../components/PreviewPane";

describe("PreviewPane エラー系結合テスト", () => {
  beforeEach(() => {
    // fetch失敗をモック
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
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

  it("画像コピーAPI失敗時にエラー通知が表示される", async () => {
    render(<PreviewPane html="<div>テスト領域</div>" />);

    // 領域選択イベントをasync actでラップ
    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: "region-select",
            outerHTML: '<div class="selected">テスト領域</div>',
            rect: { width: 100, height: 50 },
          },
        })
      );
    });

    // ボタンが有効化されるまで待つ
    const regionCopyBtn = await waitFor(() =>
      screen.getByRole("button", { name: "選択領域のみ画像コピー" })
    );
    expect(regionCopyBtn).not.toBeDisabled();

    // 画像コピーもasync actでラップ
    await act(async () => {
      fireEvent.click(regionCopyBtn);
    });

    // エラー通知UIが表示されるか（実際の通知文言に合わせて検証）
    await waitFor(
      () => {
        expect(
          screen.getByText(/画像化APIでエラーが発生しました/)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
