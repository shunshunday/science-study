const { test, expect } = require("@playwright/test");
test("city builder boots and renders its 3D canvas", async ({ page }) => {
 const pageErrors=[]; page.on("pageerror",error=>pageErrors.push(error.message));
 await page.goto("/city.html",{waitUntil:"domcontentloaded"});
 const canvas=page.locator("#game canvas"); await expect(canvas).toBeVisible({timeout:60000});
 await expect(page.locator("#buildModeBtn")).toBeVisible(); await expect(page.locator("#population")).toBeVisible();
 const size=await canvas.evaluate(el=>({w:el.width,h:el.height,cw:el.clientWidth,ch:el.clientHeight}));
 expect(size.w).toBeGreaterThan(0); expect(size.h).toBeGreaterThan(0); expect(size.cw).toBeGreaterThan(0); expect(size.ch).toBeGreaterThan(0);
 expect(pageErrors,"uncaught browser errors").toEqual([]);
});