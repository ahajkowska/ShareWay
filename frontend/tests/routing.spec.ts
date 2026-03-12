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

});