import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import puppeteer from "puppeteer";
import { build, preview } from "vite";

let server;
let browser;
let url;

before(async () => {
  await build({ logLevel: "silent" });
  server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
  url = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await puppeteer.launch({ headless: true });
});

after(async () => {
  try {
    await browser?.close();
  } finally {
    if (server) {
      server.httpServer.closeAllConnections();
      await new Promise((resolve) => server.httpServer.close(resolve));
    }
  }
});

for (const mode of [null, "steps", "final"]) {
  test(`PDF ${mode || "default"} contains loaded images, SVG icons and 16:9 pages without filters`, async () => {
    const page = await browser.newPage();
    try {
      await page.setCacheEnabled(false);
      await page.goto(`${url}/?print-pdf${mode ? `&pdf-mode=${mode}` : ""}`);
      await page.waitForSelector('html[data-pdf-state="ready"]');
      const result = await page.evaluate(() => ({
        pages: document.querySelectorAll(".pdf-page").length,
        states: [...document.querySelectorAll(".pdf-page")].map((p) => ({
          slide: p.querySelector("section").className,
          fragments: [...p.querySelectorAll(".fragment")].map((f) => ({
            index: Number(f.dataset.fragmentIndex),
            visible: f.classList.contains("visible"),
            opacity: getComputedStyle(f).opacity,
            visibility: getComputedStyle(f).visibility,
          })),
        })),
        invalidPages: [...document.querySelectorAll(".pdf-page")].filter(
          (p) => {
            const r = p.getBoundingClientRect();
            return r.width !== 1920 || r.height !== 1080;
          },
        ).length,
        brokenImages: [...document.images].filter(
          (i) => !i.complete || !i.naturalWidth || !i.getAttribute("src"),
        ).length,
        lazyImages: document.querySelectorAll("img[data-src]").length,
        icons: document.querySelectorAll("svg[data-lucide]").length,
        missingIcons: document.querySelectorAll("i[data-lucide]").length,
        filteredElements: [...document.querySelectorAll(".slides *")].filter(
          (e) => getComputedStyle(e).filter !== "none",
        ).length,
      }));
      const slideCount = new Set(result.states.map((s) => s.slide)).size;
      assert.equal(slideCount, 11);
      assert.equal(result.pages, mode === "final" ? slideCount : 20);
      if (mode === "final") {
        assert(slideCount > 0);
        for (const state of result.states) {
          for (const fragment of state.fragments) {
            assert.equal(fragment.visible, true);
            assert.equal(fragment.visibility, "visible");
            assert.equal(fragment.opacity, "1");
          }
        }
      } else {
        for (const slide of new Set(result.states.map((s) => s.slide))) {
          const states = result.states.filter((s) => s.slide === slide);
          const indices = [
            ...new Set(states[0].fragments.map((f) => f.index)),
          ].sort((a, b) => a - b);
          assert.equal(states.length, indices.length + 1);
          states.forEach((state, step) => {
            for (const fragment of state.fragments) {
              assert.equal(
                fragment.visible,
                indices.indexOf(fragment.index) < step,
              );
            }
          });
        }
      }
      assert.equal(result.invalidPages, 0);
      assert.equal(result.brokenImages, 0);
      assert.equal(result.lazyImages, 0);
      assert(result.icons > 0);
      assert.equal(result.missingIcons, 0);
      assert.equal(result.filteredElements, 0);
    } finally {
      await page.close();
    }
  });
}

test("an image failure reports its URL and prevents ready status", async () => {
  const page = await browser.newPage();
  try {
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().includes("cover-character-")) request.abort();
      else request.continue();
    });
    await page.goto(`${url}/?print-pdf`);
    await page.waitForSelector('html[data-pdf-state="error"]');
    const errors = await page.evaluate(() =>
      JSON.parse(document.documentElement.dataset.pdfErrors),
    );
    assert(errors.some((source) => source.includes("cover-character-")));
  } finally {
    await page.close();
  }
});

test("ordinary slides keep filters, icons and fragment navigation", async () => {
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector(".presentation-progress");
    assert.notEqual(
      await page.$eval(".binding-icon svg", (e) => getComputedStyle(e).filter),
      "none",
    );
    await page.click('[data-action="next"]');
    await page.waitForSelector(".comparison-slide.present");
    await page.click('[data-action="next"]');
    await page.waitForSelector(".comparison-question.visible");
    await page.click('[data-action="overview"]');
    await page.waitForSelector(".reveal.overview");
  } finally {
    await page.close();
  }
});
