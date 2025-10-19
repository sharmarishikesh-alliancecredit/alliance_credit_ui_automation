import { test, expect } from '@playwright/test';



test('Verify if main table in legal-search section is visible', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Login As Admin' }).click();
  await expect(page.locator('div').filter({ hasText: 'File Ref. IdFileFile' }).nth(4)).toBeVisible();
});

test('Verify if the legal search button is clickable and redirects to search page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Login As Admin' }).click();
  await expect(page.getByText('Legal Search')).toBeEnabled();
  await page.getByText('Legal Search').click();
  await expect(page.getByRole('main')).toContainText('Legal Information Search');
});

