// App Router方式: HTML→画像化API（puppeteer使用）
import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  const { html, width = 800, height = 600 } = await req.json();
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const imageBuffer = await page.screenshot({ type: "png", fullPage: true });
    await browser.close();
    // Uint8ArrayをそのままResponseのbodyに渡す
    return new Response(Buffer.from(imageBuffer), {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    if (browser) await browser.close();
    return new Response(
      JSON.stringify({ error: "画像化処理でエラー", detail: String(err) }),
      { status: 500 }
    );
  }
}
