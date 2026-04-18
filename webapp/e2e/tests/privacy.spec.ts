import { test, expect } from "@playwright/test";

test.describe("プライバシーポリシーページ", () => {
	test("プライバシーポリシーページが正常に表示される", async ({ page }) => {
		const response = await page.goto("/privacy");

		expect(response?.status()).toBe(200);
		await expect(page).toHaveTitle(/自治体財政まる見え/);
	});
});
