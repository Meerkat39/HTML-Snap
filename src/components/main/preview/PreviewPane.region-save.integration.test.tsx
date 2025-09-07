import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PreviewPane from "./PreviewPane";

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

describe("PreviewPane 領域指定保存 結合テスト", () => {
  it("領域選択→選択領域のみ画像コピー→通知表示", async () => {
    render(<PreviewPane html="<div>テスト領域</div>" />);

    // 領域選択イベントをactでラップ
    await import("react").then(({ act }) =>
      act(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "region-select",
              outerHTML: '<div class="selected">テスト領域</div>',
              rect: { width: 100, height: 50 },
            },
          })
        );
      })
    );

    // ボタンが有効化されるまで待つ
    const regionCopyBtn = await waitFor(() =>
      screen.getByRole("button", { name: "選択領域のみ画像コピー" })
    );
    expect(regionCopyBtn).not.toBeDisabled();

    // 画像コピーもactでラップ
    await import("react").then(({ act }) =>
      act(() => {
        fireEvent.click(regionCopyBtn);
      })
    );

    // 通知UIが表示されるか
    await waitFor(
      () => {
        expect(
          screen.getByText(/画像をクリップボードにコピーしました/)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
