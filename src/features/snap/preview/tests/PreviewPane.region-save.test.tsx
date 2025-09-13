// 領域指定保存（選択領域のみ画像コピー）機能のテスト
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PreviewPane from "../components/PreviewPane";

// fetchとClipboard APIのモック
const fetchMock = jest.fn();
global.fetch = fetchMock;
const clipboardWriteMock = jest.fn();
beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      write: clipboardWriteMock,
    },
  });
  // ClipboardItem型を明示的に定義
  class MockClipboardItem {
    constructor(items: Record<string, Blob>) {
      return items;
    }
  }
  Object.defineProperty(window, "ClipboardItem", {
    value: MockClipboardItem,
    configurable: true,
  });
});

describe("領域指定保存（選択領域のみ画像コピー）", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    clipboardWriteMock.mockReset();
  });

  it("選択領域のみ画像コピーでAPI・クリップボードが呼ばれる", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(["dummy"], { type: "image/png" }),
    });
    // region-selectイベントを模擬
    render(<PreviewPane html="<div id='test'>領域テスト</div>" />);
    // 選択領域をセット
    window.postMessage(
      {
        type: "region-select",
        outerHTML: "<div id='test'>領域テスト</div>",
        rect: { width: 100, height: 50 },
      },
      "*"
    );
    // ボタン押下
    const btn = await screen.findByRole("button", {
      name: "選択領域のみ画像コピー",
    });
    await waitFor(() => expect(btn).not.toBeDisabled());
    fireEvent.click(btn);
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(clipboardWriteMock).toHaveBeenCalled();
    });
  });

  it("API失敗時にエラー通知UIが表示される", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      blob: async () => new Blob(),
    });
    render(<PreviewPane html="<div>領域テスト</div>" />);
    window.postMessage(
      {
        type: "region-select",
        outerHTML: "<div>領域テスト</div>",
        rect: { width: 100, height: 50 },
      },
      "*"
    );
    const btn = await screen.findByRole("button", {
      name: "選択領域のみ画像コピー",
    });
    await waitFor(() => expect(btn).not.toBeDisabled());
    fireEvent.click(btn);
    await waitFor(() => {
      expect(
        screen.getByText(/画像化APIでエラーが発生しました/)
      ).toBeInTheDocument();
    });
  });

  it("領域未選択時はボタンがdisabled", async () => {
    render(<PreviewPane html="<div>領域テスト</div>" />);
    const btn = await screen.findByRole("button", {
      name: "選択領域のみ画像コピー",
    });
    expect(btn).toBeDisabled();
  });
});
