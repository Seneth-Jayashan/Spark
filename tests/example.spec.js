// @ts-check
import { test, expect } from '@playwright/test';

test('Negative Test: Should block deployment on failure', async ({ page }) => {
  await page.goto('http://localhost:5173'); 
  // We expect this to fail because this element does not exist
  const fakeButton = page.locator('text="THIS_BUTTON_DOES_NOT_EXIST"');
  await expect(fakeButton).toBeVisible({ timeout: 2000 }); 
});

test('Positive Test: Should allow deployment on success', async ({ page }) => {
  await page.goto('http://localhost:5173'); 
  // This passes because the application successfully loads on the local port
  await expect(page).toHaveURL(/.*localhost.*/); 
});