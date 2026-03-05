// @ts-check
import { test, expect } from '@playwright/test';

test('Pipeline Test: Should block deployment on failure', async ({ page }) => {
  // Go to your local app
  await page.goto('http://localhost:5173'); 

  // Look for a button that DOES NOT exist to force an error
  const fakeButton = page.locator('text="THIS_BUTTON_DOES_NOT_EXIST"');
  await expect(fakeButton).toBeVisible({ timeout: 2000 }); 
});