import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分待つ（大きめに）
  },
  testMatch: ["e2e/**/*.spec.ts"], // E2EテストだけをPlaywrightで実行
  use: {
    baseURL: "http://localhost:3000",
    headless: true, // CI・Docker環境では必ずheadless
  },
});
