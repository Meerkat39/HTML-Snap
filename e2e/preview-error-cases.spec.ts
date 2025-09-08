import { expect, test } from "@playwright/test";

// API失敗時のエラー通知表示（APIをモックしてエラーを返す）
test("画像コピーAPI失敗時にエラー通知が表示される", async ({
  page,
  baseURL,
}) => {
  await page.route("**/api/html2image", (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: "Internal Error" }),
    });
  });
  await page.goto(baseURL ?? "/");
  const copyBtn = page.getByRole("button", {
    name: "レンダリング結果を画像コピー",
  });
  await copyBtn.click();
  await expect(
    page.getByText(
      /画像化APIでエラーが発生しました|画像化処理でエラーが発生しました|画像化用HTMLが空です/
    )
  ).toBeVisible();
});

// 空入力時の挙動（コピー不可や通知が出ないこと）
test("空入力時は画像コピー通知が出ない", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  const textarea = page.getByRole("textbox");
  await textarea.fill("");
  const copyBtn = page.getByRole("button", {
    name: "レンダリング結果を画像コピー",
  });
  await copyBtn.click();
  // 通知が出ない、またはエラー通知が出ること
  await expect(page.getByText(/コピーしました|コピーに成功/)).not.toBeVisible();
});

// 連打時の挙動（通知が重複しない・最新のみ表示）
test("コピー連打時は通知が重複せず最新のみ表示", async ({ page, baseURL }) => {
  await page.goto(baseURL ?? "/");
  const copyBtn = page.getByRole("button", {
    name: "レンダリング結果を画像コピー",
  });
  for (let i = 0; i < 3; i++) {
    await copyBtn.click();
  }
  // 通知が1つだけ表示されていること
  const notifications = await page.locator('[role="alert"]').all();
  expect(notifications.length).toBeLessThanOrEqual(1);
});
