import { test, expect } from '@playwright/test';

test('Login and save authentication state', async ({ page }) => {
  await page.goto('https://www.betfair.com/');
  await page.getByRole('button', { name: 'Allow all cookies' }).click();
  await page.getByPlaceholder('email/username').click({ force: true });
  await page.getByPlaceholder('email/username').fill('pawanuk');
  await page.getByPlaceholder('password').click({ force: true });
  await page.getByPlaceholder('password').fill('Pawankumar12');

  await page.getByRole('button', { name: 'Log In' }).click();

  // Save the authentication state to a file
  await page.context().storageState({ path: 'auth.json' });

  console.log('Authentication state saved.');
});
