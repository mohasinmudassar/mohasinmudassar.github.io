import { test, expect } from "@playwright/test";

test("slow JavaScript preserves hydration, menu and language bars", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/_next/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5500));
    await route.continue();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Mobile menu", exact: true })).toBeVisible();
  await page.locator('#drawer a[href="#credentials"]').click();
  await expect(page.locator("#credentials")).toBeFocused();
  await expect(page.locator('[data-bar="100"]')).toHaveCSS("width", /[1-9]\d*(\.\d+)?px/);
  await expect(page.locator('[data-bar="40"]')).toHaveCSS("width", /[1-9]\d*(\.\d+)?px/);
  expect(errors).toEqual([]);
});

test("closed menu is excluded from focus; open menu traps focus and closes", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.focus();
  // Safari uses Option+Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link", { name: "See my work" })).toBeFocused();
  await trigger.click();
  const close = page.getByRole("button", { name: "Close menu", exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#drawer a[download]")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await close.click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("diagram contains focus and scroll, then restores its opener", async ({ page }) => {
  await page.goto("/");
  const opener = page.locator(".proj-figure-btn").first();
  await opener.click();
  const close = page.getByRole("button", { name: "Close", exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(10, 300);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("nested game keeps the menu locked until both dialogs close", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator("#drawer .game-toggle").click();
  await expect(page.locator(".invaders-screen canvas")).toBeFocused();
  await page.keyboard.press("Space");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "DevOps Invaders", exact: true })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Mobile menu", exact: true })).toBeVisible();
  await expect(page.locator("#drawer .game-toggle")).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("short landscape menus and diagrams remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 390 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.locator("#drawer a").first()).toBeInViewport();
  const resume = page.locator("#drawer a[download]");
  await resume.scrollIntoViewIfNeeded();
  await expect(resume).toBeInViewport();
  await page.getByRole("button", { name: "Close menu", exact: true }).click();
  await page.locator(".proj-figure-btn").first().click();
  const card = page.locator(".diagram-modal-card");
  const box = await card.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  await card.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("narrow layouts and animated headlines stay stable", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".hero-cta").evaluate(async (element) => {
    await document.fonts.ready;
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  const before = await page.locator(".hero-cta").boundingBox();
  // Exercise the longest phrase and an empty phrase without waiting for a whole cycle.
  for (const phrase of ["monitoring that catches it early", ""]) {
    await page.locator("#tw").evaluate((element, text) => { element.textContent = text; }, phrase);
    const after = await page.locator(".hero-cta").boundingBox();
    expect(after!.y).toBeCloseTo(before!.y, 0);
  }
});

test("experience, resume and metadata remain valid", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Xgrid", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Xgrid");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toContainText("Autosphere");
  const pdf = await request.get("/Mohasin-Mudassar-Resume.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mohasinmudassar.github.io/");
  const download = page.waitForEvent("download");
  await page.locator(".contact-actions a[download]").click();
  expect((await download).suggestedFilename()).toBe("Mohasin-Mudassar-Resume.pdf");
});

test("print exposes all jobs with readable text", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("tabpanel")).toHaveCount(3);
  await expect(page.locator("h1")).toHaveCSS("color", "rgb(17, 17, 17)");
  await expect(page.locator(".lede")).toHaveCSS("color", "rgb(17, 17, 17)");
});

test("the no-JavaScript fallback remains readable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("tabpanel")).toHaveCount(3);
  expect(await page.locator('[data-bar="100"]').evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThan(
    await page.locator('[data-bar="40"]').evaluate((el) => el.getBoundingClientRect().width)
  );
  await context.close();
});

test("reduced motion keeps the headline and caret still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const initial = await page.locator("#tw").innerText();
  await page.waitForTimeout(2800);
  await expect(page.locator("#tw")).toHaveText(initial);
  await expect(page.locator(".type-current .caret")).toHaveCSS("animation-name", "none");
});

test("404 offers a working route home", async ({ page }) => {
  expect((await page.goto("/missing-page"))?.status()).toBe(404);
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page.locator("h1")).toHaveText("Mohasin Mudassar.");
});
