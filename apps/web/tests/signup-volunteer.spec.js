// tests/signup-volunteer.spec.js  (POSITIVE)
import { test, expect } from '@playwright/test';

test('Volunteer Signup Flow', async ({ page }) => {
  let apiCalled = false;

  await page.route('http://localhost:3001/api/v1/**', route => {
    apiCalled = true;
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'User created successfully' }),
    });
  });

  await page.goto('/signup/volunteer');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('input[name="user_first_name"]', { timeout: 10000 });

  await page.fill('input[name="user_first_name"]', 'Test');
  await page.fill('input[name="user_last_name"]', 'Volunteer');
  await page.fill('input[name="user_email"]', 'testvolunteer@example.com');
  await page.fill('input[name="user_password"]', 'Password1');
  await page.fill('input[name="confirm_password"]', 'Password1');
  await page.fill('input[name="user_phone_number"]', '0771234567');
  await page.fill('input[name="user_address"]', 'Colombo');
  await page.check('input[name="terms"]');
  await page.click('button[type="submit"]');

  expect(apiCalled).toBeTruthy();
});