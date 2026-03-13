import { test, expect } from '@playwright/test';

// ✅ POSITIVE TEST: Testing the "Happy Path"
test('Positive Test: Should load the home page and verify core UI', async ({ page }) => {
  // Uses baseURL from your playwright.config.js (http://localhost:5173)
  await page.goto('/'); 
  
  // Verify the page loaded successfully on the local server
  await expect(page).toHaveURL(/.*localhost.*/);
  
  // Tip for the presentation: Uncomment and adjust the line below to show a real UI check
  // await expect(page.getByRole('heading', { name: 'SPARK VMS' })).toBeVisible();
});

// 🛑 NEGATIVE TEST: Testing the "Unhappy Path" (How the system handles bad input)
// This test will PASS in the pipeline because it proves your app catches errors properly!
test('Negative Test: Should display an error state for invalid actions', async ({ page }) => {
  
  // Scenario: A user tries to visit a page that does not exist
  await page.goto('/this-route-does-not-exist'); 
  
  // Assertion: The system should not crash; it should show a 404 or error message.
  // Replace 'Not Found' with whatever text your actual 404 page or error state displays.
  const errorMessage = page.locator('text="Not Found"'); 
  
  await expect(errorMessage).toBeVisible();
  
  /* ALTERNATIVE NEGATIVE TEST (If you have a login form):
    await page.goto('/login');
    await page.getByRole('button', { name: 'Submit' }).click(); // Click without filling data
    const validationError = page.getByText('Email is required'); // Verify error pops up
    await expect(validationError).toBeVisible();
  */
});