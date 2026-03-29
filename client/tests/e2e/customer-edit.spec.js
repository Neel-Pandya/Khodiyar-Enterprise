import { test, expect } from '@playwright/test';

test.describe('Customer Edit Functionality', () => {
  test('should edit customer successfully', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for navigation to admin dashboard
    await page.waitForURL('/admin/dashboard');

    // Navigate to customers page
    await page.goto('/admin/customers');

    // Wait for customers to load
    await page.waitForSelector('table');

    // Get the first customer row
    const firstRow = page.locator('tbody tr').first();

    // Get initial data from the row
    const initialName = await firstRow.locator('td').nth(0).locator('p').textContent();
    const initialEmail = await firstRow.locator('td').nth(1).locator('p').textContent();
    const initialStatus = await firstRow.locator('td').nth(2).locator('span').last().textContent();

    // Click edit button (Edit2 icon link)
    await firstRow.locator('a').click();

    // Wait for edit page to load
    await page.waitForURL(/\/admin\/customers\/edit\/\d+/);

    // Verify form preloads with existing data
    const nameInput = page.locator('input').filter({ hasText: /^$/ }).first(); // Full Name input
    await expect(nameInput).toHaveValue(initialName.trim());

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue(initialEmail.trim());

    // Verify password field is hidden on edit
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveCount(0);

    // Get current status in form
    const statusSelect = page.locator('select');
    const currentFormStatus = await statusSelect.inputValue();

    // Change status (toggle between active/inactive)
    const newStatus = currentFormStatus.toLowerCase() === 'active' ? 'inactive' : 'active';
    await statusSelect.selectOption(newStatus);

    // Submit the form
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: 'Save Changes' });
    await submitButton.click();

    // Wait for success state
    await expect(submitButton).toHaveText('Changes Saved!');

    // Wait for redirect back to customers page
    await page.waitForURL('/admin/customers');

    // Verify the update persists - check the first row status changed
    const updatedStatus = await firstRow.locator('td').nth(2).locator('span').last().textContent();
    const expectedDisplayStatus = newStatus === 'active' ? 'Active' : 'Suspended'; // Based on normalization in CustomersPage
    expect(updatedStatus.trim()).toBe(expectedDisplayStatus);
  });
});