import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Pass the locally installed Lighthouse entry point as the first argument.
const { default: lighthouse } = await import(
  pathToFileURL(resolve(process.argv[2])).href
);
const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
  args: ["--remote-debugging-port=9223"],
});
try {
  const result = await lighthouse("http://127.0.0.1:3000/bible/genesis/1", {
    port: 9223,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  await mkdir("test-results", { recursive: true });
  await writeFile(
    "test-results/lighthouse-reader.json",
    JSON.stringify(result.lhr, null, 2),
  );
  console.log(
    Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, value]) => [
        key,
        value.score,
      ]),
    ),
  );
  console.log(
    Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
      ].map((key) => [key, result.lhr.audits[key].displayValue]),
    ),
  );
  console.log(
    Object.values(result.lhr.audits)
      .filter(
        (a) => a.score !== null && a.score < 1 && a.details?.type === "table",
      )
      .map((a) => ({ id: a.id, title: a.title })),
  );
} finally {
  await browser.close();
}
