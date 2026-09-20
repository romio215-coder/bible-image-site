import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

// Desktop and mobile each exercise real browser persistence, navigation and image downloads.
test("background library, range recommendations and handwriting exports", async ({
  page,
}, info) => {
  await page.goto("/bible/exodus/14");
  await page.locator("#verse-1").click();
  const panel =
    info.project.name === "mobile"
      ? page.getByRole("dialog", { name: "선택한 말씀" })
      : page.locator(".desktop-verse-panel");
  await expect(
    panel.getByRole("button", { name: "바다 01", exact: true }),
  ).toBeVisible();
  await panel.getByLabel("배경 테마", { exact: true }).selectOption("forest");
  await expect(panel.locator(".background-option")).toHaveCount(12);
  await panel.getByRole("button", { name: "다음 배경" }).click();
  await expect(panel.locator(".background-option")).toHaveCount(8);
  await panel.getByRole("button", { name: "숲 20", exact: true }).click();
  await panel.getByLabel("카드 글꼴").selectOption("handwriting");
  const downloadButton = panel.getByRole("button", {
    name: "말씀카드 다운로드",
  });
  await expect(downloadButton).toBeEnabled();
  expect(
    await page.evaluate(() =>
      document.fonts.check('400 56px "WordLight Pen"', "여호와"),
    ),
  ).toBe(true);
  const before = await panel
    .locator("canvas")
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  const downloaded = page.waitForEvent("download");
  await downloadButton.click();
  const file = await downloaded;
  const bytes = await readFile((await file.path())!);
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");
  expect(bytes.readUInt32BE(20)).toBe(1350);
  await panel.getByLabel("카드 글꼴").selectOption("serif");
  await expect(downloadButton).toBeEnabled();
  const after = await panel
    .locator("canvas")
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  expect(after).not.toEqual(before);
  await panel.getByLabel("배경 테마", { exact: true }).selectOption("all");
  await expect(panel.locator(".background-caption")).toContainText(
    "204개 배경",
  );
  await expect(panel.getByRole("button", { name: "이전 배경" })).toBeDisabled();
  await panel.getByLabel("카드 글꼴").selectOption("handwriting");
  await expect(downloadButton).toBeEnabled();
  await panel.screenshot({
    path: `test-results/${info.project.name}-background-library.png`,
  });
});

test("reading, selection, image download, saved settings and chapter navigation", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "당신의 하루에, 말씀 한 줄의 빛." }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/${info.project.name}-home.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "성경 읽기 시작" }).click();
  await expect(page.locator(".verse")).toHaveCount(31);
  await page.locator("#verse-1").click();
  const mobile = info.project.name === "mobile";
  const panel = mobile
    ? page.getByRole("dialog", { name: "선택한 말씀" })
    : page.locator(".desktop-verse-panel");
  await expect(panel.getByRole("img")).toHaveAccessibleName(
    /태초에 하나님이 천지를 창조하시니라/,
  );
  await panel.getByRole("button", { name: "새벽", exact: true }).click();
  await panel.getByLabel("이미지 비율").selectOption("1:1");
  await expect(
    panel.getByRole("button", { name: "말씀카드 다운로드" }),
  ).toBeEnabled();
  const downloadPromise = page.waitForEvent("download");
  await panel.getByRole("button", { name: "말씀카드 다운로드" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("창세기-1장-1절.png");
  const image = await readFile((await download.path())!);
  expect(image.subarray(1, 4).toString()).toBe("PNG");
  expect(image.readUInt32BE(16)).toBe(1080);
  expect(image.readUInt32BE(20)).toBe(1080);
  await panel.getByRole("button", { name: "저장", exact: true }).click();
  await expect(panel.getByRole("button", { name: "저장됨" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await panel.getByRole("button", { name: "묵상", exact: true }).click();
  await panel.getByLabel("묵상 메모").fill("오늘의 시작을 감사하며.");
  await panel.getByRole("button", { name: "묵상 저장", exact: true }).click();
  await expect(panel.getByRole("status")).toContainText("묵상을 기기에 저장");
  await page.screenshot({
    path: `test-results/${info.project.name}-reader-selected.png`,
    fullPage: false,
  });
  if (mobile)
    await panel.getByRole("button", { name: "닫기", exact: true }).click();
  await page.getByRole("button", { name: "읽기 설정", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "읽기 설정" });
  await settings.getByRole("slider").fill("26");
  await settings.getByRole("button", { name: "고딕", exact: true }).click();
  await settings.getByRole("button", { name: "닫기", exact: true }).click();
  await page.reload();
  await expect(page.locator(".chapter-article")).toHaveClass(/sans-text/);
  await expect(page.locator("#verse-1")).toHaveCSS("font-size", "26px");
  await page
    .getByRole("button", { name: "현재 장에서 찾기", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "현재 장에서 찾기", exact: true })
    .fill("빛");
  await expect(page.locator(".search-match").first()).toBeVisible();
  await page.getByRole("button", { name: "검색 닫기", exact: true }).click();
  await page.getByRole("button", { name: "다크 모드로 전환" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "창세기 1장", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "성경 선택" });
  await picker.getByRole("button", { name: "신약 27" }).click();
  await picker.getByRole("button", { name: "요한복음", exact: true }).click();
  await picker.getByRole("link", { name: "요한복음 3장", exact: true }).click();
  await expect(page).toHaveURL("/bible/john/3");
  await expect(page.locator(".verse")).toHaveCount(36);
  await page.getByRole("button", { name: "이 장 읽음 표시" }).click();
  await page.getByRole("link", { name: "다음 장", exact: true }).click();
  await expect(page).toHaveURL("/bible/john/4");
  await page.goto("/bookmarks");
  await expect(page.locator(".saved-list")).toContainText(
    "태초에 하나님이 천지를 창조하시니라",
  );
  await page.goto("/notes");
  await expect(page.locator(".note-body")).toHaveText(
    "오늘의 시작을 감사하며.",
  );
  await page.goto("/reading-plan");
  await expect(
    page.getByRole("progressbar", { name: "전체 성경 통독 진행률" }),
  ).toHaveAttribute("value", "1");
  await page.goto("/bible/genesis/51");
  await expect(
    page.getByRole("heading", { name: "해당 성경 구절을 찾을 수 없습니다." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("all books, verse routes, search and responsive rendering", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3000/bible/1-peter/5");
  await expect(staticPage.locator(".verse")).toHaveCount(14);
  await expect(staticPage.locator("#verse-7")).toContainText(
    "너희 염려를 다 주께 맡겨",
  );
  await context.close();
  await page.goto("/bible/revelation/22/21");
  await expect(page.locator("#verse-21")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.goto("/search?q=" + encodeURIComponent("요한복음 3:16"));
  await expect(page.locator(".verse-results>a")).toHaveCount(1);
  await expect(page.locator(".verse-results")).toContainText(
    "하나님이 세상을 이처럼 사랑하사",
  );
  await page.goto(
    "/search?q=" + encodeURIComponent("사랑") + "&testament=new&book=1-john",
  );
  await expect(page.locator(".verse-results>a").first()).toContainText(
    "요한일서",
  );
  await page.goto("/topics");
  await expect(page.locator(".topic-grid>a")).toHaveCount(24);
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/bible/psalms/119",
      "/search?q=사랑",
      "/topics",
      "/settings",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route + " at " + width,
      ).toBeTruthy();
    }
  }
});

test("range cards, WebP, bookmark backup and import", async ({
  page,
}, info) => {
  await page.goto("/bible/john/3/16?end=18");
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "말씀카드", exact: true }).click();
  const panel =
    info.project.name === "mobile"
      ? page.getByRole("dialog", { name: "선택한 말씀" })
      : page.locator(".desktop-verse-panel");
  await expect(
    panel.getByRole("heading", { name: "요한복음 3:16–18", exact: true }),
  ).toBeVisible();
  await panel.getByLabel("저장 형식").selectOption("webp");
  await panel.getByLabel("이미지 비율").selectOption("9:16");
  await expect(
    panel.getByRole("button", { name: "말씀카드 다운로드" }),
  ).toBeEnabled();
  const result = page.waitForEvent("download");
  await panel.getByRole("button", { name: "말씀카드 다운로드" }).click();
  const output = await result;
  const data = await readFile((await output.path())!);
  expect(data.subarray(0, 4).toString()).toBe("RIFF");
  expect(data.subarray(8, 12).toString()).toBe("WEBP");
  await panel.getByRole("button", { name: "저장", exact: true }).click();
  await page.goto("/settings");
  const backupPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 다운로드" }).click();
  const backup = await backupPromise;
  const backupPath = (await backup.path())!;
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByLabel("백업 JSON 파일").setInputFiles(backupPath);
  await page.getByRole("button", { name: "백업 합치기" }).click();
  await page.goto("/bookmarks");
  await expect(page.locator(".saved-list")).toContainText("요한복음 3:16–18");
  await page.locator(".saved-list a").click();
  await expect(page.locator("#verse-18")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("offline fallback reads the last chapter", async ({ page, context }) => {
  await page.goto("/bible/psalms/23");
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.waitForFunction(() =>
    localStorage.getItem("wordlight:offline-chapter")?.includes("psalms"),
  );
  await context.setOffline(true);
  await page.goto("/bible/genesis/2");
  await expect(page.locator("#title")).toHaveText("시편 23장");
  await expect(page.locator("#verses")).toContainText("여호와는 나의 목자시니");
  await context.setOffline(false);
});

test("storage failures never report success and malformed backups are rejected", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "wordlight:user:v1")
        throw new DOMException("full", "QuotaExceededError");
      return original.call(this, key, value);
    };
  });
  await page.goto("/bible/genesis/1");
  await page.locator("#verse-1").click();
  const panel =
    info.project.name === "mobile"
      ? page.getByRole("dialog", { name: "선택한 말씀" })
      : page.locator(".desktop-verse-panel");
  await expect(
    panel.getByRole("button", { name: "말씀카드 다운로드" }),
  ).toBeEnabled();
  await panel.getByRole("button", { name: "저장", exact: true }).click();
  await expect(panel.getByRole("status")).toContainText("저장하지 못했습니다");
  await expect(
    panel.getByRole("button", { name: "저장", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.goto("/settings");
  await page.getByLabel("백업 JSON 파일").setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("status")).toContainText("지원하지 않는 백업");
  await expect(page.getByRole("button", { name: "백업 합치기" })).toHaveCount(
    0,
  );
});
