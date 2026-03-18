import { test, expect } from '@playwright/test';

import { loginAsUser } from './helpers/e2e';

test.describe('Ochrona ścieżek (routing)', () => {
  test('ST-ROUTE-01: niezalogowany użytkownik jest przekierowany z /dashboard na /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  });

  test('ST-ROUTE-02: zalogowany użytkownik ma dostęp do /dashboard', async ({ page }) => {
    await loginAsUser(page);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard(?:\?.*)?$/);
  });

  test('ST-ROUTE-03: wylogowanie przekierowuje użytkownika na stronę główną', async ({ page }) => {
    await loginAsUser(page);

    await page.route('**/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Logged out' }),
      });
    });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard(?:\?.*)?$/);

    // Otworzenie menu użytkownika
    await page.locator('button[aria-label="User menu"]').click();

    // przycisk wylogowania
    await page.getByRole('button', { name: /wyloguj/i }).click();

    // strona główna
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$/);

    // symulacja usunięcia access_token przez serwer po logout
    await page.context().clearCookies();

    // Sprawdzenie, że chroniona ścieżka jest znowu niedostępna
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  });

});
