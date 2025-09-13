import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PreviewPane from "./PreviewPane";

// fetchとClipboard APIのモックを毎回リセット
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
  // ClipboardItemの型エラー回避
  // @ts-expect-error ClipboardItem is not defined in JSDOM, this is a test mock
  window.ClipboardItem = function (items: Record<string, Blob>) {
    return items;
  };
});

describe("PreviewPane 結合テスト", () => {
  it("エディタ入力→プレビューiframe生成→画像コピー通知まで一連の流れ", async () => {
    render(<PreviewPane html="<h1>テスト</h1>" />);
    // プレビューiframeが生成され、srcDocに「テスト」が含まれるか
    const iframe = screen.getByTitle("HTMLプレビュー");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("srcDoc", expect.stringContaining("テスト"));

    // 画像コピー
    const copyBtn = screen.getByRole("button", {
      name: "レンダリング結果を画像コピー",
    });
    fireEvent.click(copyBtn);

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
