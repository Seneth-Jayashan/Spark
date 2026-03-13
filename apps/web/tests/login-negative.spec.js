// tests/login-negative.spec.js  (NEGATIVE)
import { test, expect } from '@playwright/test';

test.describe('Login - Negative Tests', () => {

  async function goToLogin(page) {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="email"]', { timeout: 20000 });
  }

  // ─── 1. Empty form submission ─────────────────────────────────────────────
  test('should not navigate away on empty form submission', async ({ page }) => {
    await goToLogin(page);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  // ─── 2. Invalid email format ──────────────────────────────────────────────
  test('should not submit with invalid email format', async ({ page }) => {
    await goToLogin(page);
    await page.fill('input[name="email"]', 'notanemail');
    await page.fill('input[name="password"]', 'Password1');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  // ─── 3. Wrong password ────────────────────────────────────────────────────
  test('should show failure for wrong password', async ({ page }) => {
    await goToLogin(page);

    await page.route('http://localhost:3001/api/v1/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    await page.fill('input[name="email"]', 'tharusharukshan9@gmail.com');
    await page.fill('input[name="password"]', 'WrongPassword1');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
    const successTitle = page.locator('.swal2-title');
    const isSuccess = await successTitle.isVisible() &&
      (await successTitle.innerText()) === 'Login Successful!';
    expect(isSuccess).toBeFalsy();
  });

  // ─── 4. Non-existent user ─────────────────────────────────────────────────
  test('should show failure for non-existent user', async ({ page }) => {
    await goToLogin(page);

    await page.route('http://localhost:3001/api/v1/**', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'User not found' }),
      });
    });

    await page.fill('input[name="email"]', 'ghost@nobody.com');
    await page.fill('input[name="password"]', 'Password1');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
    const successTitle = page.locator('.swal2-title');
    const isSuccess = await successTitle.isVisible() &&
      (await successTitle.innerText()) === 'Login Successful!';
    expect(isSuccess).toBeFalsy();
  });

  // ─── 5. Empty password ────────────────────────────────────────────────────
  test('should not submit with empty password', async ({ page }) => {
    await goToLogin(page);
    await page.fill('input[name="email"]', 'tharusharukshan9@gmail.com');
    // ❌ intentionally leave password empty
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  // ─── 6. Empty email ───────────────────────────────────────────────────────
  test('should not submit with empty email', async ({ page }) => {
    await goToLogin(page);
    // ❌ intentionally leave email empty
    await page.fill('input[name="password"]', 'Password1');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  // ─── 7. Server error on login ─────────────────────────────────────────────
  test('should handle server error gracefully', async ({ page }) => {
    await goToLogin(page);

    await page.route('http://localhost:3001/api/v1/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal server error' }),
      });
    });

    await page.fill('input[name="email"]', 'tharusharukshan9@gmail.com');
    await page.fill('input[name="password"]', 'Password1');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
    const successTitle = page.locator('.swal2-title');
    const isSuccess = await successTitle.isVisible() &&
      (await successTitle.innerText()) === 'Login Successful!';
    expect(isSuccess).toBeFalsy();
  });
});