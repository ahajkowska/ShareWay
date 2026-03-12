import { test, expect, Page } from '@playwright/test';

const E2E_AUTH_COOKIE = '__shareway_e2e_auth';
const E2E_USER = {
  id: 'e2e-user',
  name: 'Jan Kowalski',
  email: 'test@shareway.com',
  role: 'user',
} as const;

function encodeE2EUser() {
  return Buffer.from(JSON.stringify(E2E_USER)).toString('base64url');
}

async function loginAsUser(page: Page) {
  await page.context().addCookies([
    {
      name: E2E_AUTH_COOKIE,
      value: encodeE2EUser(),
      url: 'http://localhost:3000',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

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

    // Otwórz menu użytkownika (desktop navbar)
    await page.locator('button[aria-label="User menu"]').click();

    // Kliknij przycisk wylogowania
    await page.getByRole('button', { name: /wyloguj/i }).click();

    // Po wylogowaniu aplikacja przekierowuje na stronę główną
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$/);

    // Usuń E2E cookie – symuluje usunięcie access_token przez serwer po logout
    await page.context().clearCookies();

    // Sprawdź, że chroniona ścieżka jest znowu niedostępna
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  });

});