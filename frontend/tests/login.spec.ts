import { test, expect, type Locator } from '@playwright/test';

async function typeAndAssertValue(locator: Locator, value: string) {
  await locator.click();
  await locator.fill('');
  await locator.pressSequentially(value);
  await expect(locator).toHaveValue(value);
}

test.describe('Strona Logowania', () => {

  test('Załadowanie formularzu logowania', async ({ page }) => {
    await page.goto('/login');

    // Nagłówek "Zaloguj się"
    await expect(page.getByRole('heading', { name: /Zaloguj/i })).toBeVisible();

    // Pola na email i hasło
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Przycisk logowania
    await expect(page.getByRole('button', { name: /Zaloguj/i })).toBeVisible();
  });

  test('Błędy przy błędnych danych logowania', async ({ page }) => {
    // Przechwycenie żądania logowania
    await page.route(/\/auth\/login/, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    await page.goto('/login');
    await page.waitForTimeout(300);

    // Wypełnienie formularza błędnymi danymi
    const emailInput = page.locator('#login-email');
    const passwordInput = page.locator('#login-password');
    const submitButton = page.getByRole('button', { name: /Zaloguj/i });

    await typeAndAssertValue(emailInput, 'zle@dane.pl');
    await typeAndAssertValue(passwordInput, 'ZleHaslo123');

    const loginRequest = page.waitForRequest(
      (request) => /\/auth\/login/.test(request.url()) && request.method() === 'POST'
    );

    await submitButton.click();
    await loginRequest;

    // Komunikat: "Nieprawidłowy e-mail lub hasło."
    await expect(
      page
        .locator('form [role="alert"]')
        .filter({ hasText: /Nieprawidłowy e-mail lub hasło|Invalid credentials/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Walidacja pustego formularza logowania', async ({ page }) => {
    await page.goto('/login');

    // Dotknięcie pola email i opuszczenie bez wypełnienia
    await page.locator('#login-email').click();
    await page.locator('#login-password').click();
    await page.locator('#login-email').click();

    await expect(page.locator('#login-email-error')).toBeVisible();
  });

});