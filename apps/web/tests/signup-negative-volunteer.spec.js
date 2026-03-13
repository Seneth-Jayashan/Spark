// tests/signup-negative.spec.js  (NEGATIVE)
import { test, expect } from '@playwright/test';

test.describe('Volunteer Signup - Negative Tests', () => {

  async function goToVolunteerForm(page) {
    await page.goto('/signup/volunteer');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="user_first_name"]', { timeout: 10000 });
  }

  async function fill(page, name, value) {
    await page.locator(`input[name="${name}"]`).fill(value);
  }

  async function checkTerms(page) {
    await page.locator('input[name="terms"]').check();
  }

  async function submitForm(page) {
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(300);
  }

  async function getErrors(page) {
    await page.waitForTimeout(200);
    return await page.locator('p.text-red-500').allInnerTexts();
  }

  // ─── 1. Submit completely empty form ─────────────────────────────────────
  test('should show errors when submitting empty form', async ({ page }) => {
    await goToVolunteerForm(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors).toContain('First name is required');
    expect(errors).toContain('Last name is required');
    expect(errors).toContain('Email is required');
    expect(errors).toContain('Password is required');
    expect(errors).toContain('Phone number is required');
    expect(errors).toContain('Address is required');
    expect(errors).toContain('You must agree to the terms');
  });

// ─── 2. Invalid email format ──────────────────────────────────────────────
test('should show error for invalid email format', async ({ page }) => {
  await goToVolunteerForm(page);

  await fill(page, 'user_first_name', 'Test');
  await fill(page, 'user_last_name', 'Volunteer');
  await fill(page, 'user_email', 'wrong@invalid'); 
  await fill(page, 'user_password', 'Password1');
  await fill(page, 'confirm_password', 'Password1');
  await fill(page, 'user_phone_number', '0771234567');
  await fill(page, 'user_address', 'Colombo');
  await checkTerms(page);
  await submitForm(page);

  const errors = await getErrors(page);
  expect(errors.some(e => e.includes('Email format is invalid'))).toBeTruthy();
});

  // ─── 3. Password too short ────────────────────────────────────────────────
  test('should show error for password shorter than 8 characters', async ({ page }) => {
    await goToVolunteerForm(page);

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Ab1'); // ❌ too short
    await fill(page, 'confirm_password', 'Ab1');
    await fill(page, 'user_phone_number', '0771234567');
    await fill(page, 'user_address', 'Colombo');
    await checkTerms(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('Password must be at least 8 characters'))).toBeTruthy();
  });

  // ─── 4. Passwords do not match ───────────────────────────────────────────
  test('should show error when passwords do not match', async ({ page }) => {
    await goToVolunteerForm(page);

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password2'); // ❌ mismatch
    await fill(page, 'user_phone_number', '0771234567');
    await fill(page, 'user_address', 'Colombo');
    await checkTerms(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('Passwords do not match'))).toBeTruthy();
  });

  // ─── 5. Invalid phone number ─────────────────────────────────────────────
  test('should show error for invalid phone number', async ({ page }) => {
    await goToVolunteerForm(page);

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password1');
    await fill(page, 'user_phone_number', '12345'); // ❌ invalid
    await fill(page, 'user_address', 'Colombo');
    await checkTerms(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('Enter a valid phone number'))).toBeTruthy();
  });

  // ─── 6. Phone number with letters ────────────────────────────────────────
  test('should show error for phone number containing letters', async ({ page }) => {
    await goToVolunteerForm(page);

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password1');
    await fill(page, 'user_phone_number', 'abcdefghij'); // ❌ letters
    await fill(page, 'user_address', 'Colombo');
    await checkTerms(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('Enter a valid phone number'))).toBeTruthy();
  });

  // ─── 7. Terms not accepted ────────────────────────────────────────────────
  test('should show error when terms are not accepted', async ({ page }) => {
    await goToVolunteerForm(page);

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password1');
    await fill(page, 'user_phone_number', '0771234567');
    await fill(page, 'user_address', 'Colombo');
    // ❌ intentionally skip checkTerms
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('You must agree to the terms'))).toBeTruthy();
  });

  // ─── 8. Empty first name ─────────────────────────────────────────────────
  test('should show error for empty first name', async ({ page }) => {
    await goToVolunteerForm(page);

    // ❌ intentionally skip first name
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password1');
    await fill(page, 'user_phone_number', '0771234567');
    await fill(page, 'user_address', 'Colombo');
    await checkTerms(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('First name is required'))).toBeTruthy();
  });

  // ─── 9. Empty address ────────────────────────────────────────────────────
  test('should show error for empty address', async ({ page }) => {
    await goToVolunteerForm(page);

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password1');
    await fill(page, 'user_phone_number', '0771234567');
    // ❌ intentionally skip address
    await checkTerms(page);
    await submitForm(page);

    const errors = await getErrors(page);
    expect(errors.some(e => e.includes('Address is required'))).toBeTruthy();
  });

  // ─── 10. API failure handling ─────────────────────────────────────────────
  test('should handle API error gracefully', async ({ page }) => {
    await goToVolunteerForm(page);

    await page.route('http://localhost:3001/api/v1/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal server error' }),
      });
    });

    await fill(page, 'user_first_name', 'Test');
    await fill(page, 'user_last_name', 'Volunteer');
    await fill(page, 'user_email', 'test@example.com');
    await fill(page, 'user_password', 'Password1');
    await fill(page, 'confirm_password', 'Password1');
    await fill(page, 'user_phone_number', '0771234567');
    await fill(page, 'user_address', 'Colombo');
    await checkTerms(page);
    await submitForm(page);

    await expect(page.locator('.swal2-popup')).not.toBeVisible({ timeout: 5000 });
  });
});