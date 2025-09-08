import { expect, test } from "@playwright/test";
import { mockClipboard } from "./mockClipboard";

test.beforeEach(async ({ page }) => {
  await mockClipboard(page);
});

// トップ画面表示・UI要素の存在確認

test("トップ画面のUI要素がすべて表示される", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  await expect(page.getByText("🖼️ プレビュー")).toBeVisible();
  await expect(page.getByRole("textbox")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "レンダリング結果を画像コピー" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "選択領域のみ画像コピー" })
  ).toBeVisible();
});

// ページリロード後もUI・状態が初期化される

test("ページリロードでUI・状態が初期化される", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  const textarea = page.getByRole("textbox");
  await textarea.fill("<h2>リロードテスト</h2>");
  await page.reload();
  // 初期状態（空欄 or デフォルト値）に戻ること
  await expect(textarea).toHaveValue("");
});

// モバイル/PC両方の画面幅での動作確認

test.describe("画面幅ごとの動作確認", () => {
  test("PC幅でUIが正しく表示される", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(baseURL ?? "/");
    await expect(page.getByRole("textbox")).toBeVisible();
  });
  test("モバイル幅でUIが正しく表示される", async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto(baseURL ?? "/");
    await expect(page.getByRole("textbox")).toBeVisible();
  });
});

// 通知UIの自動消滅タイミング検証

test("通知UIが一定時間で自動消滅する", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  const copyBtn = page.getByRole("button", {
    name: "レンダリング結果を画像コピー",
  });
  await copyBtn.click();
  const notification = page.getByText(/画像をクリップボードにコピーしました/);
  await expect(notification).toBeVisible();
  // 3秒後などで消える想定（実装に応じて調整）
  await page.waitForTimeout(3500);
  await expect(notification).not.toBeVisible();
});

// 主要なエラーケース・異常系（APIエラー・空入力・連打等）
// API失敗時のエラー通知表示は、モックやネットワークエラーのシミュレートが必要
// ...
