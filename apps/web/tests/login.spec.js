// tests/login.spec.js  (POSITIVE)
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.waitForSelector('input[name="email"]', { timeout: 20000 });

  await page.fill('input[name="email"]', 'tharusharukshan9@gmail.com');
  await page.fill('input[name="password"]', '12345678');
  await page.click('button[type="submit"]');

  const popup = page.locator('.swal2-popup');
  await expect(popup).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.swal2-title')).toHaveText('Login Successful!');
  await expect(page.locator('.swal2-html-container')).toContainText('Welcome back');
});