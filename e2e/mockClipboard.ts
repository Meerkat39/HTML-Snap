// Playwright用クリップボードAPIモック
// E2Eテスト時、headless環境でもnavigator.clipboard.writeが常に成功するように上書き

// PlaywrightのpageにクリップボードAPIのモックを注入
export async function mockClipboard(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        write: async () => Promise.resolve(),
        writeText: async () => Promise.resolve(),
      },
      configurable: true,
    });
    // ClipboardItemの型エラー回避用ダミー
    if (!("ClipboardItem" in window)) {
      // ClipboardItemの型エラー回避用ダミー（items型をRecord<string, Blob|Promise<Blob>>等に）
      class DummyClipboardItem {
        constructor(items: Record<string, Blob | Promise<Blob>>) {
          return items;
        }
      }
      // @ts-expect-error 型定義上の差異を無視してwindowに追加
      window.ClipboardItem = DummyClipboardItem;
    }
  });
}
