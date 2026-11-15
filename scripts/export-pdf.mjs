import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { build, preview } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const mode = process.argv[2] || "steps";
if (!["steps", "final"].includes(mode) || process.argv.length > 3) {
  console.error("Usage: node scripts/export-pdf.mjs [steps|final]");
  process.exit(1);
}
const output = path.join(root, `output/pdf/relations-presentation-${mode}.pdf`);
let server;
let browser;

try {
  await build({ root });
  server = await preview({ root, preview: { host: "127.0.0.1", port: 0 } });
  const address = server.httpServer.address();
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCacheEnabled(false);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(
    `http://127.0.0.1:${address.port}/?print-pdf&pdf-mode=${mode}`,
    {
      waitUntil: "domcontentloaded",
    },
  );
  await page.waitForFunction(() =>
    ["ready", "error"].includes(document.documentElement.dataset.pdfState),
  );
  const imageErrors = await page.evaluate(() =>
    JSON.parse(document.documentElement.dataset.pdfErrors || "[]"),
  );
  if (imageErrors.length) {
    throw new Error(`Failed to load PDF images:\n${imageErrors.join("\n")}`);
  }
  if (pageErrors.length) throw new Error(pageErrors.join("\n"));
  await page.waitForFunction(() => document.fonts.status === "loaded");
  await page.emulateMediaType("print");
  const result = await page.evaluate(() => {
    const pages = [...document.querySelectorAll(".pdf-page")];
    const images = [...document.querySelectorAll(".slides img")];
    const broken = images.filter(
      (image) => !image.complete || image.naturalWidth === 0,
    );
    const invalidPages = pages.filter((page) => {
      const bounds = page.getBoundingClientRect();
      return bounds.width !== 1920 || bounds.height !== 1080;
    });
    return {
      pages: pages.length,
      images: images.length,
      broken: broken.map((image) => image.currentSrc || image.dataset.src),
      invalidPages: invalidPages.length,
      missingIcons: document.querySelectorAll("i[data-lucide]").length,
    };
  });
  if (result.broken.length) {
    throw new Error(`Broken PDF images:\n${result.broken.join("\n")}`);
  }
  if (!result.pages || result.invalidPages || result.missingIcons) {
    throw new Error(`Incomplete PDF layout: ${JSON.stringify(result)}`);
  }
  await mkdir(path.dirname(output), { recursive: true });
  await page.pdf({
    path: output,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    timeout: 60000,
  });
  console.log(
    `PDF saved: ${output} (${result.pages} pages, ${result.images} images)`,
  );
} catch (error) {
  console.error(`PDF export failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  try {
    await browser?.close();
  } finally {
    if (server) {
      server.httpServer.closeAllConnections();
      await new Promise((resolve) => server.httpServer.close(resolve));
    }
  }
}
