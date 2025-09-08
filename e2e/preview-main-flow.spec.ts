import { expect, test } from "@playwright/test";
import { mockClipboard } from "./mockClipboard";

test.beforeEach(async ({ page }) => {
  await mockClipboard(page);
});

// HTML入力 → プレビュー反映
// 1. テキストエリアにHTMLを入力し、プレビューに反映されることを確認

test("HTML入力でプレビューが即時反映される", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");

  // テスト用のHTML
  const testHTML = "<h1>テスト見出し</h1><p>テスト本文</p>";

  // エディタ（テキストエリア）に入力
  const textarea = page.getByRole("textbox");
  await textarea.fill(testHTML);

  // プレビューiframe内の内容を取得して検証
  const iframe = page.frameLocator("iframe");
  await expect(iframe.locator("h1")).toHaveText("テスト見出し");
  await expect(iframe.locator("p")).toHaveText("テスト本文");
});

// 画像コピー（全体）→ 通知表示
// 2. 「レンダリング結果を画像コピー」ボタン押下で通知が表示されること

test("画像コピーで通知が表示される", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");

  // 事前にHTMLを入力
  const textarea = page.getByRole("textbox");
  await textarea.fill("<h2>通知テスト</h2><p>本文</p>");

  // ボタンをクリック
  const copyBtn = page.getByRole("button", {
    name: "レンダリング結果を画像コピー",
  });
  await copyBtn.click();
  // CI環境の描画ラグ対策: 通知要素の出現を確実に待つ
  const notification = page.getByText(/画像をクリップボードにコピーしました/);
  await notification.waitFor({ state: "attached", timeout: 10000 });
  await expect(notification).toBeVisible();
});

// 領域選択 → 選択領域のみ画像コピー → 通知表示
// 3. 領域選択後、「選択領域のみ画像コピー」ボタン押下で通知が表示されること

test("領域選択後に選択領域のみ画像コピーで通知", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");

  // 1. テキストエリアに選択可能なHTMLを入力
  const testHTML = '<div id="selectable">選択テスト</div>';
  const textarea = page.getByRole("textbox");
  await textarea.fill(testHTML);

  // 2. postMessageで領域選択イベントを直接送信（E2E安定化のため）
  await page.evaluate(() => {
    window.postMessage(
      {
        type: "region-select",
        outerHTML: '<div id="selectable">選択テスト</div>',
        rect: { width: 100, height: 30 },
      },
      "*"
    );
  });
  // 少し待つ（状態反映のため）
  await page.waitForTimeout(100);

  // 3. ボタンがenabledになるのを待ってクリック
  const areaCopyBtn = page.getByRole("button", {
    name: "選択領域のみ画像コピー",
  });
  await expect(areaCopyBtn).toBeEnabled();
  await areaCopyBtn.click();

  // 通知が表示されること
  await expect(
    page.getByText(/画像をクリップボードにコピーしました/)
  ).toBeVisible();
});

// 領域未選択時は「選択領域のみ画像コピー」ボタンが disabled

test("領域未選択時は選択領域のみ画像コピーがdisabled", async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL ?? "/");
  const areaCopyBtn = page.getByRole("button", {
    name: "選択領域のみ画像コピー",
  });
  await expect(areaCopyBtn).toBeDisabled();
});

// エディタでHTMLを変更 → プレビューiframeの内容が即時反映

test("エディタ変更でプレビューiframeが即時更新", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  const textarea = page.getByRole("textbox");
  await textarea.fill("<div>変更テスト</div>");
  const iframe = page.frameLocator("iframe");
  await expect(iframe.locator("div")).toHaveText("変更テスト");
});

// 画像コピー・領域コピーの連続操作（通知の切り替わり・消滅）

test("コピー操作の連続で通知が切り替わる", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  const copyBtn = page.getByRole("button", {
    name: "レンダリング結果を画像コピー",
  });
  await copyBtn.click();
  await expect(
    page.getByText(/画像をクリップボードにコピーしました/)
  ).toBeVisible();
  // すぐにもう一度コピー
  await copyBtn.click();
  await expect(page.getByText(/コピーしました|コピーに成功/)).toBeVisible();
});

// API失敗時のエラー通知表示（モックが必要な場合は後述）
// ...
