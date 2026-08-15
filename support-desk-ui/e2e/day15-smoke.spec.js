import { test, expect } from '@playwright/test';

test.describe('Support Desk E2E Smoke Test', () => {
  test('completes full flow: login -> view dashboard -> create ticket', async ({ page }) => {
    // 1. Open /login page
    await page.goto('/login');

    // 2. Login as seeded admin/test user
    await page.getByLabel(/email|username/i).fill('maya.doe@company.com');
    await page.getByLabel(/password/i).fill('Password123');
    await page.getByRole('button', { name: /login|sign in/i }).click();

    // 3. Confirm dashboard opens
    await expect(page).toHaveURL(/.*dashboard/i);

    // 4. Open the Tickets page
    await page.getByRole('link', { name: /tickets/i }).click();
    await expect(page).toHaveURL(/.*tickets/i);

    // 5. Open Create Ticket form
    await page.getByRole('link', { name: /create ticket|new ticket/i }).click();

    // 6. Submit valid ticket with explicit input locators
const main = page.locator('main');

// Target the Title text input specifically
await main.locator('input[type="text"]').first().fill('E2E Smoke Test Ticket');

// Target the Description textarea specifically
await main.locator('textarea').fill('Automated end-to-end verification via Playwright.');

// Select Category
await main.getByRole('combobox').first().selectOption('Technical');

// Submit the form
await page.getByRole('button', { name: /create ticket/i }).click();

// 7. Confirm redirect back to tickets list and verify ticket presence
await expect(page).toHaveURL(/\/app\/tickets$/);
await expect(page.getByText('E2E Smoke Test Ticket')).toBeVisible();
  });
});