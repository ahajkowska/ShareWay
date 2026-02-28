import { test, expect } from '@playwright/test';

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

    // Wypełnienie formularza błędnymi danymi
    await page.locator('input[type="email"]').fill('zle@dane.pl');
    await page.locator('input[type="password"]').fill('ZleHaslo123');

    await page.getByRole('button', { name: /Zaloguj/i }).click();

    // Komunikat: "Nieprawidłowy e-mail lub hasło."
    await expect(page.getByText(/Nieprawidłowy e-mail lub has/i)).toBeVisible({ timeout: 8000 });
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