import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Welcome to SvelteKit');
});

test('index page has button', async ({ page }) => {
	await page.goto('/');

	let button = page.locator('button').first()
	await expect(button).toBeVisible();
	await expect(button).toHaveText('PLAY');
})

test('login', async ({ page }) => {
	await page.goto('/');

	await page.fill('input', 'myname');
	await page.click('button');
	await page.screenshot({path: 'screenshot.png'});
})