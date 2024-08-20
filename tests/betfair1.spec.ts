import { test, expect } from '@playwright/test';

// Helper function to generate random odds and betting amounts
function generateRandomBetData() {
  const randomOdds = (Math.random() * (5 - 1.01) + 1.01).toFixed(2); // Odds between 1.01 and 5.00
  const randomAmount = (Math.random() * (500 - 10) + 10).toFixed(2); // Amount between 10 and 500
  return { odds: randomOdds, amount: randomAmount };
}

// Data set of candidates
const candidates = ["Kamala Harris", "Donald Trump", "Nikki Haley"];

test.use({ storageState: 'auth.json' });

test.describe('Place bets on candidates with random data', () => {
  candidates.forEach(candidateName => {
    test(`Place bet for ${candidateName}`, async ({ page }) => {
      await page.goto('https://www.betfair.com/');
      const allowCookiesButton = page.getByRole('button', { name: 'Allow all cookies' });

      // Check if the "Allow all cookies" button is present on the page
      if (await allowCookiesButton.count() > 0) {
        await allowCookiesButton.click();
        console.log('Clicked on "Allow all cookies" button.');
      } else {
        console.log('"Allow all cookies" button not found, skipping click.');
      }

      await page.getByPlaceholder('email/username').click({ force: true });
      await page.getByPlaceholder('email/username').fill('pawanuk');
      await page.getByPlaceholder('password').click({ force: true });
      await page.getByPlaceholder('password').fill('Pawankumar12');
    
      await page.getByRole('button', { name: 'Log In' }).click();
      // Assume the user is already logged in, so navigate directly to the page of interest
      await page.locator('#subnav').getByRole('link', { name: 'Politics' }).click();

      // Generate random data for each test
      const { odds, amount } = generateRandomBetData();

      async function placeBetForCandidate(page, candidateName, amount, odds) {
          console.log(`Placing bet for: ${candidateName}`);

          // Step 1: Click the "Back" button for the candidate
          const candidateRow = page.locator(`//h3[text()="${candidateName}"]/ancestor::tr`);
          const backButton = candidateRow.locator('.bet-buttons.back-cell.last-back-cell button:has-text("£")');

          await backButton.click();
          console.log(`Clicked "Back" button for ${candidateName}`);

          // Step 2: Wait for the side window (betslip) to appear
          await page.waitForSelector('betslip-editable-bet');
          console.log('Betslip opened.');

          // Step 3: Locate the betslip for the candidate and interact with the fields
          const betslip = page.locator('betslip-editable-bet').filter({ hasText: `${candidateName} £` });

          const textBoxLocator = betslip.locator('betslip-price-ladder').getByRole('textbox');
          const sizeInputLocator = betslip.locator('betslip-size-input').getByRole('textbox');

          // Fill in the odds and amount
          await textBoxLocator.fill(odds);
          console.log(`Filled odds: ${odds} for ${candidateName}`);

          await sizeInputLocator.fill(amount);
          console.log(`Filled amount: ${amount} for ${candidateName}`);
      }

      // Place bet with random data
      await placeBetForCandidate(page, candidateName, amount, odds);

      await page.pause();
      await page.getByRole('button', { name: 'Log Out' }).click();
    });
  });
});
