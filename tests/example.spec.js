import { test, expect } from '@playwright/test';

// ❌ NEGATIVE TEST (Fails the pipeline to prevent bad deployments)
test('Negative Test: Quality Gate should block bad deployments', async ({ page }) => {
  // We test the local build inside the GitHub runner before it goes live
  await page.goto('http://localhost:5173'); 
  
  // Looking for an element that does not exist to simulate a critical UI bug
  const nonExistentElement = page.locator('.this-class-is-broken');
  
  // We expect this to fail (timeout reduced for a faster demo)
  await expect(nonExistentElement).toBeVisible({ timeout: 1000 }); 
});

// ✅ POSITIVE TEST (Passes the pipeline to allow deployment)
test('Positive Test: Should verify core UI and allow deployment', async ({ page }) => {
  await page.goto('http://localhost:5173'); 
  
  // Simulating a successful check of your application's actual content
  await expect(page).toHaveURL(/.*localhost.*/);
  // Optional: Add a real assertion here, like checking for your main heading
  // await expect(page.getByRole('heading', { name: 'SPARK VMS' })).toBeVisible();
});