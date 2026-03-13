import { test, expect } from '@playwright/test'; // Import Playwright test framework
import fs from 'fs'; // Import filesystem module to save debug files


// ------------------------------------------------------------
// Function: navigateToCreate
// Purpose: Navigate from organizer dashboard to the Create Event page
// ------------------------------------------------------------
const navigateToCreate = async (page) => {

  console.log("➡ Navigating to Create Event page");

  // Ensure the user is currently on the organizer dashboard
  await expect(page).toHaveURL(/.*\/dashboard\/organizer.*/, { timeout: 30000 });

  // Locate navigation link that goes directly to create event page
  const createEventLinkByHref = page.locator('a[href="/dashboard/organizer/event/create"]').first();

  // Alternative button locator (in case navigation uses a button instead of link)
  const createEventButton = page.getByRole('button', { name: /new event|event create|create event/i }).first();

  // If link exists click it
  if (await createEventLinkByHref.count()) {

    await createEventLinkByHref.click({ force: true });

  // Otherwise try clicking the create event button
  } else if (await createEventButton.isVisible().catch(() => false)) {

    await createEventButton.click();

  } else {

    // If neither navigation element exists throw error
    throw new Error('Could not find organizer navigation to create event');
  }

  try {

    // Verify navigation to create event page
    await expect(page).toHaveURL(/.*\/dashboard\/organizer\/event\/create.*/, { timeout: 5000 });

    console.log("✅ Create Event page opened successfully");

  } catch {

    // Fallback navigation method if SPA routing fails
    await page.evaluate(() => {

      // Manually push new route to browser history
      window.history.pushState({}, '', '/dashboard/organizer/event/create');

      // Trigger popstate event to notify React router
      window.dispatchEvent(new PopStateEvent('popstate'));

    });

    // Confirm navigation again
    await expect(page).toHaveURL(/.*\/dashboard\/organizer\/event\/create.*/, { timeout: 30000 });
  }
};


// ------------------------------------------------------------
// Function: loginWithCredentials
// Purpose: Log into the system before running tests
// ------------------------------------------------------------
const loginWithCredentials = async (page) => {

  console.log("➡ Logging in with test credentials");

  // Get base URL from environment variables or fallback to localhost
  const base = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:5173';

  // Construct login page URL
  const url = `${base.replace(/\/$/, '')}/login`;

  // Open login page
  await page.goto(url, { timeout: 60000, waitUntil: 'load' });

  // Fill email input field
  await page.fill('input[name="email"]', 'sajanaanupama123@gmail.com');

  // Fill password input field
  await page.fill('input[name="password"]', '12345678');

  // Locate login button
  const submit = page.locator('button[type="submit"]').first();

  // Scroll button into view before clicking
  await submit.scrollIntoViewIfNeeded();

  // Click login button
  await submit.click({ force: true });

  // Locate login success popup
  const swal = page.locator('.swal2-popup:has-text("Login Successful")');

  try {

    // Wait until popup becomes visible
    await expect(swal).toBeVisible({ timeout: 15000 });

    console.log("✅ Login successful");

    // Locate popup OK button
    const okButton = page.getByRole('button', { name: 'OK' }).first();

    // Click OK if visible
    if (await okButton.isVisible().catch(() => false)) {

      await okButton.click();
    }

  } catch {}

  // Verify redirect to organizer dashboard
  await expect(page).toHaveURL(/.*\/dashboard\/organizer.*/, { timeout: 30000 });

  // Wait until network requests finish loading
  await page.waitForLoadState('networkidle').catch(() => {});

  // Get current page URL
  const currentUrl = page.url();

  // Save browser storage state for debugging
  await page.context().storageState({ path: 'test-results/storageState.json' }).catch(() => {});

  // Detect unexpected redirect back to login page
  if (currentUrl.includes('/login')) {

    throw new Error('Detected redirect back to login after submitting credentials');
  }
};


// ------------------------------------------------------------
// Test Suite: Create Event Page
// ------------------------------------------------------------
test.describe('Create Event Page', () => {

  // Increase timeout because login + navigation can be slow
  test.describe.configure({ timeout: 120000 });

  // Run login and navigation before each test
  test.beforeEach(async ({ page }) => {

    // Log into system
    await loginWithCredentials(page);

    // Navigate to create event page
    await navigateToCreate(page);

  });


  // ------------------------------------------------------------
  // TEST 1 - POSITIVE TEST
  // Purpose: Verify event can be created successfully
  // ------------------------------------------------------------
  test('positive: renders form fields, selects map location and creates event', async ({ page }) => {

    console.log("🔍 TEST 1: Creating a new event");

    // Multiple selectors for event name input to improve reliability
    const nameSelectors = 'input[name="event_name"], input[placeholder="Event Name"], input[id="event_name"]';

    try {

      // Wait until event name input appears
      await page.waitForSelector(nameSelectors, { timeout: 90000 });

    } catch (err) {

      // If page fails to load properly save debug files
      try {

        if (!page.isClosed()) {

          // Capture screenshot
          await page.screenshot({ path: 'test-results/create-event-debug-webkit.png', fullPage: true });

          // Save HTML content
          fs.writeFileSync('test-results/create-event-debug-webkit.html', await page.content());

          console.log('Saved debug artifacts to test-results/');

        }

      } catch (e) {

        console.log('Failed to write debug artifacts', e);
      }

      throw err;
    }

    // Verify event name field is visible
    await expect(page.locator('input[name="event_name"]')).toBeVisible({ timeout: 20000 });

    // Verify description textarea
    await expect(page.locator('textarea[name="event_description"]')).toBeVisible();

    // Verify event date input
    await expect(page.locator('input[name="event_date"]')).toBeVisible();

    // Verify event time input
    await expect(page.locator('input[name="event_time"]')).toBeVisible();

    // Verify event venue input
    await expect(page.locator('input[name="event_venue"]')).toBeVisible();

    // Verify participant count input
    await expect(page.locator('input[name="need_count"]')).toBeVisible();

    // Locate event image upload input
    const fileInput = page.locator('input[name="event_images"]');

    // Ensure file input exists
    await expect(fileInput).toHaveCount(1);

    // Confirm file input is hidden (custom upload UI)
    await expect(fileInput).toBeHidden();

    // Locate Leaflet map
    const map = page.locator('.leaflet-container').first();

    // Ensure map is visible
    await expect(map).toBeVisible({ timeout: 10000 });

    // Scroll map into view
    await map.scrollIntoViewIfNeeded();

    // Get map size and position
    const box = await map.boundingBox();

    if (box) {

      // Click center of map to set location
      await map.click({ position: { x: Math.floor(box.width / 2), y: Math.floor(box.height / 2) } });

      // Verify location selection message
      await expect(page.locator('text=Selected')).toBeVisible({ timeout: 5000 });

      console.log("✅ Map location selected");

    } else {

      // Skip test if map bounding box unavailable
      test.skip(true, 'map bounding box not available');
      return;
    }

    // Generate unique event name
    const eventName = `Playwright Test Event ${Date.now()}`;

    // Fill event form fields
    await page.fill('input[name="event_name"]', eventName);
    await page.fill('textarea[name="event_description"]', 'This is a test.');
    await page.fill('input[name="event_date"]', '2025-12-31');
    await page.fill('input[name="event_time"]', '12:00');
    await page.fill('input[name="event_venue"]', 'Test Venue');
    await page.fill('input[name="need_count"]', '5');

    // Locate submit button
    const submitBtn = page.getByRole('button', { name: /create event/i }).first();

    // Scroll button into view
    await submitBtn.scrollIntoViewIfNeeded();

    // Track create event API response
    const createEventResponsePromise = page.waitForResponse(
      (response) => response.request().method() === 'POST' && response.url().includes('/event'),
      { timeout: 20000 }
    );

    // Submit form
    await submitBtn.click();

    // Ensure backend create request succeeded
    const createEventResponse = await createEventResponsePromise;
    expect(createEventResponse.ok()).toBeTruthy();

    // Locate success popup
    const successPopup = page.locator('.swal2-popup:has-text("Event Created!")');

    try {

      // Wait for popup
      await expect(successPopup).toBeVisible({ timeout: 20000 });

      // Dismiss success popup if present
      const okButton = page.getByRole('button', { name: 'OK' }).first();
      if (await okButton.isVisible().catch(() => false)) {

        await okButton.click();
      }

      console.log("✅ Event created successfully");

    } catch {

      // Alternative flow: redirect to event list
      await expect(page).toHaveURL(/.*\/dashboard\/organizer\/event\/events.*/, { timeout: 20000 });

    }

    // Verify user is no longer blocked on the success modal
    await expect(successPopup).toHaveCount(0);

  });


  // ------------------------------------------------------------
  // TEST 2 - NEGATIVE TEST
  // Purpose: Ensure event cannot be created when form is empty
  // ------------------------------------------------------------
  test('negative: does not submit when required fields are empty', async ({ page }) => {

    console.log("🔍 TEST 2: Submitting empty event form");

    const submitBtn = page.getByRole('button', { name: /create event/i }).first();

    await submitBtn.scrollIntoViewIfNeeded();

    // Click submit without filling form
    await submitBtn.click({ force: true });

    // Verify user remains on create event page
    await expect(page).toHaveURL(/.*\/dashboard\/organizer\/event\/create.*/, { timeout: 10000 });

  });


  // ------------------------------------------------------------
  // TEST 3 - NEGATIVE TEST
  // Purpose: Ensure event creation fails when API returns error
  // ------------------------------------------------------------
  test('negative: API failure should not navigate to events list', async ({ page }) => {

    console.log("🔍 TEST 3: Simulating backend API failure");

    // Intercept event creation API request
    await page.route('**/*', async (route) => {

      const request = route.request();
      const reqUrl = request.url();
      const body = request.postData() || '';

      const isCreateEventPost =
        request.method() === 'POST' &&
        reqUrl.includes('/event') &&
        (body.includes('event_name') || body.includes('event_description'));

      if (isCreateEventPost) {

        // Simulate server error
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Create event failed from test.' }),
        });

        return;
      }

      await route.continue();
    });

    // Generate event name
    const eventName = `Playwright Failed Event ${Date.now()}`;

    // Fill event form
    await page.fill('input[name="event_name"]', eventName);
    await page.fill('textarea[name="event_description"]', 'This should fail.');
    await page.fill('input[name="event_date"]', '2025-12-31');
    await page.fill('input[name="event_time"]', '12:00');
    await page.fill('input[name="event_venue"]', 'Test Venue');
    await page.fill('input[name="need_count"]', '5');

    const submitBtn = page.getByRole('button', { name: /create event/i }).first();

    await submitBtn.scrollIntoViewIfNeeded();

    // Submit event form
    await submitBtn.click({ force: true });

    // Verify user remains on create page
    await expect(page).toHaveURL(/.*\/dashboard\/organizer\/event\/create.*/, { timeout: 20000 });

    console.log("✅ Event creation blocked due to API failure");

  });

});