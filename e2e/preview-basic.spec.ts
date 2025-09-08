import { expect, test } from "@playwright/test";

test("プレビュー画面の基本表示", async ({ page, baseURL }) => {
  // webServerオプションでサーバー自動起動・待機済み
  // baseURLを使ってアクセス
  await page.goto(baseURL ?? "/");

  // ヘッダーや主要UIが表示されていることを確認
  await expect(page.getByText("🖼️ プレビュー")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "レンダリング結果を画像コピー" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "選択領域のみ画像コピー" })
  ).toBeVisible();
});
