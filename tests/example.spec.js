import { test, expect } from '@playwright/test';

// ✅ POSITIVE TEST
test('Positive Test: Should load the home page and verify core UI', async ({ page }) => {
  await page.goto('/'); 
  
  await expect(page).toHaveURL(/.*localhost.*/);
  
});

// 🛑 NEGATIVE TEST:
test('Negative Test: Should display an error state for invalid actions', async ({ page }) => {
  
  await page.goto('/this-route-does-not-exist'); 
  
  const errorMessage = page.locator('text="404 - Page Not Found"'); 
  
  await expect(errorMessage).toBeVisible(); 

});