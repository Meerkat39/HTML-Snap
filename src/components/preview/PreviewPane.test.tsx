// html2canvas-proをモック化（JSDOM未対応API回避）
jest.mock("html2canvas-pro", () => async () => ({
  toDataURL: () => "data:image/png;base64,",
  toBlob: (cb: (blob: Blob) => void) => cb(new Blob()),
}));
// PreviewPaneの画像コピー機能テスト
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PreviewPane from "./PreviewPane";

// Clipboard APIのモック
const clipboardWriteMock = jest.fn();
beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      write: clipboardWriteMock,
    },
  });
  // ClipboardItemのモック
  (
    window as unknown as {
      ClipboardItem: (items: Record<string, Blob>) => Record<string, Blob>;
    }
  ).ClipboardItem = function (items: Record<string, Blob>) {
    return items;
  };
});

describe("PreviewPane画像コピー機能", () => {
  it("画像コピーボタン押下でクリップボードAPIが呼ばれる", async () => {
    render(<PreviewPane html="<h1>テスト</h1>" />);
    const btn = screen.getByRole("button", { name: /画像コピー/ });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(clipboardWriteMock).toHaveBeenCalled();
    });
  });

  it("コピー成功時に通知UIが表示される", async () => {
    clipboardWriteMock.mockResolvedValueOnce(undefined);
    render(<PreviewPane html="<h1>テスト</h1>" />);
    const btn = screen.getByRole("button", { name: /画像コピー/ });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(
        screen.getByText(/画像をクリップボードにコピーしました/)
      ).toBeInTheDocument();
    });
  });

  it("コピー失敗時にエラー通知UIが表示される", async () => {
    clipboardWriteMock.mockRejectedValueOnce(new Error("fail"));
    render(<PreviewPane html="<h1>テスト</h1>" />);
    const btn = screen.getByRole("button", { name: /画像コピー/ });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(
        screen.getByText(/クリップボードへのコピーに失敗しました/)
      ).toBeInTheDocument();
    });
  });
});
