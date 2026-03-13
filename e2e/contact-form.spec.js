import { test, expect } from '@playwright/test';

// Function to navigate to the contact page.
// It retries up to 3 times in case the dev server is slow or temporarily unavailable.
const navigateToContact = async (page) => {

	// Get base URL from environment variables or fallback to localhost
	const base = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';

	// Construct the contact page URL
	const url = `${base.replace(/\/$/, '')}/contact`;

	// Log navigation step in terminal
	console.log("➡ Navigating to Contact Page...");

	// Retry navigation up to 3 times if loading fails
	for (let attempt = 0; attempt < 3; attempt++) {
		try {

			// Navigate to contact page
			await page.goto(url, { timeout: 60000, waitUntil: 'load' });

			// Confirm successful page load
			console.log("✅ Contact Page loaded successfully");
			return;

		} catch (err) {

			// If last retry fails, throw error
			if (attempt === 2) throw err;

			// Wait before retrying
			console.log(`⚠ Retry attempt ${attempt + 1} to open contact page`);
			await page.waitForTimeout(1000);
		}
	}
};

// Helper function to locate the contact form on the page.
// It finds the form that contains the "name" input field.
const contactForm = (page) =>
	page
		.locator('form') // Locate all forms
		.filter({ has: page.locator('input[name="name"]') }) // Filter form that contains name input
		.first(); // Select the first matching form

// Helper function to locate the contact form submit button
const contactSubmitButton = (page) =>
	contactForm(page)
		.locator('button[type="submit"], button:has-text("Submit")') // Find submit button
		.first();

// Function to submit the form programmatically.
// This bypasses HTML5 browser validation so we can test custom validation logic.
const submitContactForm = async (page) => {

	const form = contactForm(page);

	console.log("➡ Submitting contact form");

	await form.evaluate((el) => {

		// Disable browser default validation
		el.setAttribute('novalidate', 'novalidate');

		// Use requestSubmit if supported
		if (typeof el.requestSubmit === 'function') {
			el.requestSubmit();
		} else {

			// Fallback manual submit event
			el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		}
	});
};


// Test suite for Contact Form
test.describe('Contact Form', () => {

	// Runs before every test case.
	// Ensures each test begins from the contact page.
	test.beforeEach(async ({ page }) => {
		await navigateToContact(page);
	});


	// ------------------------------------------------------------
	// TEST 1 - UI TEST
	// Purpose: Verify that all contact form fields and the submit
	// button are displayed on the page.
	// ------------------------------------------------------------
	test('renders all contact fields and submit button', async ({ page }) => {

		console.log("🔍 TEST 1: Checking if contact form elements are visible");

		// Verify name input field is visible
		await expect(page.locator('input[name="name"]')).toBeVisible();

		// Verify email input field is visible
		await expect(page.locator('input[name="email"]')).toBeVisible();

		// Verify subject input field is visible
		await expect(page.locator('input[name="subject"]')).toBeVisible();

		// Verify message textarea is visible
		await expect(page.locator('textarea[name="message"]')).toBeVisible();

		// Verify submit button is visible
		await expect(contactSubmitButton(page)).toBeVisible();

		console.log("✅ TEST 1 PASSED: Contact form elements displayed");
	});


	// ------------------------------------------------------------
	// TEST 2 - NEGATIVE TEST
	// Purpose: Verify validation errors appear when the user
	// submits the form without entering any values.
	// Expected behavior: Required field error messages should appear.
	// ------------------------------------------------------------
	test('negative: shows required validation errors when submitted empty', async ({ page }) => {

		console.log("🔍 TEST 2: Checking validation for empty form submission");

		// Submit form without filling fields
		await submitContactForm(page);

		// Check required field validation messages
		await expect(page.locator('text=Name is required.')).toBeVisible();
		await expect(page.locator('text=Email is required.')).toBeVisible();
		await expect(page.locator('text=Subject is required.')).toBeVisible();
		await expect(page.locator('text=Message is required.')).toBeVisible();

		console.log("✅ TEST 2 PASSED: Required validation errors displayed");
	});


	// ------------------------------------------------------------
	// TEST 3 - NEGATIVE TEST
	// Purpose: Verify that fields containing only spaces are
	// treated as empty inputs and rejected by validation.
	// ------------------------------------------------------------
	test('negative: shows required error when fields contain only spaces', async ({ page }) => {

		console.log("🔍 TEST 3: Checking validation for space-only input");

		// Fill fields with spaces instead of real text
		await page.fill('input[name="name"]', '   ');
		await page.fill('input[name="email"]', '   ');
		await page.fill('input[name="subject"]', '   ');
		await page.fill('textarea[name="message"]', '   ');

		// Submit the form
		await submitContactForm(page);

		// Verify validation messages still appear
		await expect(page.locator('text=Name is required.')).toBeVisible();
		await expect(page.locator('text=Email is required.')).toBeVisible();
		await expect(page.locator('text=Subject is required.')).toBeVisible();
		await expect(page.locator('text=Message is required.')).toBeVisible();

		console.log("✅ TEST 3 PASSED: Space-only inputs rejected");
	});


	// ------------------------------------------------------------
	// TEST 4 - NEGATIVE TEST
	// Purpose: Verify application behavior when the backend API fails.
	// Expected behavior: Error popup should appear.
	// ------------------------------------------------------------
	test('negative: shows server error popup when API fails', async ({ page }) => {

		console.log("🔍 TEST 4: Simulating backend API failure");

		// Intercept API request and simulate server failure
		await page.route('**/contact/', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Server failed to save message.' }),
			});
		});

		// Fill form with valid values
		await page.fill('input[name="name"]', 'Test User');
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="subject"]', 'Need Help');
		await page.fill('textarea[name="message"]', 'Please contact me.');

		// Click submit button
		await contactSubmitButton(page).click({ force: true });

		// Locate error popup
		const errorPopup = page.locator('.swal2-popup:has-text("Error!")');

		// Verify popup is displayed
		await expect(errorPopup).toBeVisible({ timeout: 15000 });
		await expect(errorPopup).toContainText('Server failed to save message.');

		console.log("✅ TEST 4 PASSED: Server error handled correctly");
	});


	// ------------------------------------------------------------
	// TEST 5 - POSITIVE TEST
	// Purpose: Verify successful submission of contact form
	// using valid inputs.
	// Expected behavior: Success popup appears and form resets.
	// ------------------------------------------------------------
	test('positive: submits form successfully and shows success popup', async ({ page }) => {

		console.log("🔍 TEST 5: Testing successful contact form submission");

		let postedBody;

		// Intercept API request and return success response
		await page.route('**/contact/', async (route) => {

			// Capture request body sent to backend
			const request = route.request();
			postedBody = request.postDataJSON();

			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'ok' }),
			});
		});

		// Fill form with valid data
		await page.fill('input[name="name"]', 'Sajana Anupama');
		await page.fill('input[name="email"]', 'sajanaanupama123@gmail.com');
		await page.fill('input[name="subject"]', 'Volunteer Inquiry');
		await page.fill('textarea[name="message"]', 'This is a valid test submission.');

		// Click submit button
		await contactSubmitButton(page).click({ force: true });

		// Locate success popup
		const successPopup = page.locator('.swal2-popup:has-text("Success!")');

		// Verify popup appears
		await expect(successPopup).toBeVisible({ timeout: 15000 });
		await expect(successPopup).toContainText('Your message has been submitted');

		console.log("✅ TEST 5 PASSED: Contact form submitted successfully");

		// Verify form fields reset after successful submission
		await expect(page.locator('input[name="name"]')).toHaveValue('');
		await expect(page.locator('input[name="email"]')).toHaveValue('');
		await expect(page.locator('input[name="subject"]')).toHaveValue('');
		await expect(page.locator('textarea[name="message"]')).toHaveValue('');
	});
});