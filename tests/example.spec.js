// @ts-check
import { test, expect } from '@playwright/test';

test('loads the application homepage', async ({ page }) => {
  // Because we set baseURL, '/' goes straight to http://localhost:5173
  await page.goto('/');

  // Verify the frontend loaded successfully 
  await expect(page).toHaveTitle(/SPARK/i); 
});

test('can navigate to the login page', async ({ page }) => {
  await page.goto('/');

  // Example interaction: Click a button/link that exists in your UI
  // Update the accessible name to match a real button on your site
  const loginButton = page.getByRole('button', { name: 'Login' });
  
  // Only click if the button actually exists in your current UI
  if (await loginButton.isVisible()) {
    await loginButton.click();
    await expect(page).toHaveURL(/.*login/);
  }
});

test('intentional failure to test the pipeline', async ({ page }) => {
  await page.goto('/');
  // This will fail because your app's title is not "FAIL_THE_PIPELINE"
  await expect(page).toHaveTitle(/FAIL_THE_PIPELINE/); 
});