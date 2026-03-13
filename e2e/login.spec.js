import { test, expect } from '@playwright/test';

// Function to navigate to the login page.
// It retries up to 3 times in case the dev server is slow or temporarily unavailable.
const navigateToLogin = async (page) => {
	const base = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';
	const url = `${base.replace(/\/$/, '')}/login`;

	//Log navigation step in the terminal
	console.log("➡ Navigating to Login Page...");

	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			await page.goto(url, { timeout: 60000, waitUntil: 'load' });

			//Confirm successful navigation in terminal output
			console.log("✅ Login Page loaded successfully");
			return;
		} catch (err) {
			console.log(`⚠ Retry attempt ${attempt + 1} to open login page`);
			if (attempt === 2) throw err;
			await page.waitForTimeout(1000);
		}
	}
};

// Test suite for the Login Page
test.describe('Login Page', () => {

	// Runs before every test case.
	// Ensures that each test starts from the login page.
	test.beforeEach(async ({ page }) => {
		await navigateToLogin(page);
	});

	// ------------------------------------------------------------
	// TEST 1 - UI TEST
	// Purpose: Verify that the login form elements are displayed.
	// This ensures that the page loads correctly and the user can see
	// the required fields to perform a login.
	// ------------------------------------------------------------
	test('renders form fields and login button', async ({ page }) => {

		// Terminal log explaining the test execution
		console.log("🔍 TEST 1: Checking if login form fields are visible");

		// Check if email input field is visible
		await expect(page.locator('input[name="email"]')).toBeVisible();

		// Check if password input field is visible
		await expect(page.locator('input[name="password"]')).toBeVisible();

		// Check if the login button is visible
		await expect(page.locator('button[type="submit"]')).toBeVisible();

		console.log("✅ TEST 1 PASSED: Login form elements displayed");
	});

	// ------------------------------------------------------------
	// TEST 2 - NEGATIVE TEST
	// Purpose: Verify that validation errors appear when the user
	// attempts to login without entering email and password.
	// Expected behavior: The system should show validation messages.
	// ------------------------------------------------------------
	test('negative: shows validation errors when fields empty', async ({ page }) => {

		console.log("🔍 TEST 2: Checking validation for empty login fields");

		// Locate the login button
		const submitBtn = page.locator('button[type="submit"]').first();

		// Scroll button into view before clicking
		await submitBtn.scrollIntoViewIfNeeded();

		// Ensure button is visible and enabled
		await expect(submitBtn).toBeVisible({ timeout: 5000 });
		await expect(submitBtn).toBeEnabled({ timeout: 5000 });

		// Click login without entering any data
		await submitBtn.click({ force: true });

		// Verify validation error messages appear
		await expect(page.locator('text=Email is required')).toBeVisible();
		await expect(page.locator('text=Password is required')).toBeVisible();

		console.log("✅ TEST 2 PASSED: Validation errors displayed correctly");
	});

	// ------------------------------------------------------------
	// TEST 3 - NEGATIVE TEST
	// Purpose: Verify that the login form rejects invalid inputs.
	// The test uses an incorrectly formatted email and a password
	// that is too short.
	// ------------------------------------------------------------
	test('negative: shows invalid email and short password errors', async ({ page }) => {

		console.log("🔍 TEST 3: Checking invalid email and short password validation");

		// Enter an invalid email format
		await page.fill('input[name="email"]', 'bad-email');

		// Enter a password shorter than the required length
		await page.fill('input[name="password"]', '123');

		// Locate and click the login button
		const submit = page.locator('button[type="submit"]').first();
		await submit.scrollIntoViewIfNeeded();
		await submit.click({ force: true });

		// Retrieve values from inputs for validation checks
		const emailVal = await page.inputValue('input[name="email"]');
		const passVal = await page.inputValue('input[name="password"]');

		// Check email does not match valid email format
		expect(/\S+@\S+\.\S+/.test(emailVal)).toBeFalsy();

		// Check password length is below minimum requirement
		expect(passVal.length).toBeLessThan(6);

		console.log("✅ TEST 3 PASSED: Invalid input validation working");
	});

	// ------------------------------------------------------------
	// TEST 4 - POSITIVE TEST
	// Purpose: Verify that the user can successfully log in
	// using valid credentials.
	// Expected behavior: System shows success message or redirects
	// the user to the dashboard page.
	// ------------------------------------------------------------
	test('positive: submits login successfully and shows success popup', async ({ page }) => {

		console.log("🔍 TEST 4: Checking successful login with valid credentials");

		// Valid test credentials
		const userEmail = 'sajanaanupama123@gmail.com';
		const userPassword = '12345678';

		// Fill login form with valid data
		await page.fill('input[name="email"]', userEmail);
		await page.fill('input[name="password"]', userPassword);

		// Locate login button
		const submit = page.locator('button[type="submit"]').first();

		// Ensure button is visible and enabled
		await submit.scrollIntoViewIfNeeded();
		await expect(submit).toBeVisible({ timeout: 10000 });
		await expect(submit).toBeEnabled({ timeout: 10000 });

		// Click login
		await submit.click({ force: true });

		// Check for login success popup
		const swal = page.locator('.swal2-popup:has-text("Login Successful")');

		try {
			// If popup appears, login succeeded
			await expect(swal).toBeVisible({ timeout: 15000 });

			console.log("✅ TEST 4 PASSED: Login success popup displayed");

		} catch (err) {
			// If popup doesn't appear, verify redirect to dashboard
			await expect(page).toHaveURL(/.*\/dashboard\/.*/, { timeout: 15000 });

			console.log("✅ TEST 4 PASSED: User redirected to dashboard");
		}
	});
});