import { test, expect, type Locator } from '@playwright/test';

async function typeAndAssertValue(locator: Locator, value: string) {
  await locator.click();
  await locator.fill('');
  await locator.pressSequentially(value);
  await expect(locator).toHaveValue(value);
}

test.describe('Strona Rejestracji', () => {

  test('Załadowanie formularza rejestracji', async ({ page }) => {
    await page.goto('/register');

    // Nagłówek "Załóż konto"
    await expect(page.getByRole('heading', { name: /Załóż konto/i })).toBeVisible();

    // Pola formularza
    await expect(page.locator('#reg-name')).toBeVisible();
    await expect(page.locator('#reg-email')).toBeVisible();
    await expect(page.locator('#reg-password')).toBeVisible();
    await expect(page.locator('#reg-confirm')).toBeVisible();

    // Checkbox i przycisk
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Zarejestruj/i })).toBeVisible();
  });

  test('Walidacja pola imię – za krótkie (min 2 znaki)', async ({ page }) => {
    await page.goto('/register');
    await page.waitForTimeout(300);

    // Wpisanie 1 znaku i opuszczenie pola
    const nameInput = page.locator('#reg-name');
    await typeAndAssertValue(nameInput, 'A');
    await nameInput.press('Tab');

    // Komunikat walidacji imienia ma się pojawić
    await expect(page.locator('#reg-name-error')).toContainText(
      /co najmniej|at least/i
    );
  });

  test('Walidacja – hasła nie są identyczne', async ({ page }) => {
    await page.goto('/register');
    await page.waitForTimeout(300);

    const passwordInput = page.locator('#reg-password');
    const confirmInput = page.locator('#reg-confirm');

    await typeAndAssertValue(passwordInput, 'Test123!');
    await typeAndAssertValue(confirmInput, 'Inne456!');
    await confirmInput.press('Tab');

    // Błąd zgodności haseł
    await expect(page.locator('#reg-confirm-error')).toContainText(
      /nie są identyczne|do not match/i
    );
  });

  test('Walidacja formatu e-mail', async ({ page }) => {
    await page.goto('/register');
    await page.waitForTimeout(300);

    const emailInput = page.locator('#reg-email');
    await typeAndAssertValue(emailInput, 'zly-email');
    await emailInput.press('Tab');

    await expect(page.locator('#reg-email-error')).toContainText(
      /Nieprawidłowy format|Invalid email/i
    );
  });

  test('Błąd serwera – e-mail już zajęty', async ({ page }) => {
    // Mock API - zwracamy błąd "email exists"
    await page.route(/\/auth\/register/, async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email already exists' }),
      });
    });

    await page.goto('/register');
    await page.waitForTimeout(300);

    const nameInput = page.locator('#reg-name');
    const emailInput = page.locator('#reg-email');
    const passwordInput = page.locator('#reg-password');
    const confirmInput = page.locator('#reg-confirm');
    const termsCheckbox = page.locator('input[name="terms"]');

    await typeAndAssertValue(nameInput, 'Jan Kowalski');
    await typeAndAssertValue(emailInput, 'zajety@example.com');
    await typeAndAssertValue(passwordInput, 'Test123!');
    await typeAndAssertValue(confirmInput, 'Test123!');

    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();

    const registerRequest = page.waitForRequest(
      (request) => /\/auth\/register/.test(request.url()) && request.method() === 'POST'
    );

    await page.getByRole('button', { name: /Zarejestruj/i }).click();
    await registerRequest;

    // Komunikat o zajętym e-mailu
    await expect(
      page
        .locator('form [role="alert"]')
        .filter({ hasText: /Ten e-mail jest już zajęty|already in use|already exists/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Pomyślna rejestracja – nawigacja po formularzu', async ({ page }) => {
    // Mock rejestracji
    await page.route(/\/auth\/register/, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'User registered successfully' }),
      });
    });

    // Mock auto-logowania po rejestracji
    await page.route(/\/auth\/login/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'fake-token' }),
      });
    });

    // Mock profilu użytkownika
    await page.route(/\/users\/me/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          nickname: 'Jan Kowalski',
          email: 'jan@shareway.com',
          role: 'user',
        }),
      });
    });

    await page.goto('/register');
    await page.waitForTimeout(300);

    const nameInput = page.locator('#reg-name');
    const emailInput = page.locator('#reg-email');
    const passwordInput = page.locator('#reg-password');
    const confirmInput = page.locator('#reg-confirm');
    const termsCheckbox = page.locator('input[name="terms"]');

    await typeAndAssertValue(nameInput, 'Jan Kowalski');
    await typeAndAssertValue(emailInput, 'jan@shareway.com');
    await typeAndAssertValue(passwordInput, 'Test123!');
    await typeAndAssertValue(confirmInput, 'Test123!');

    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();

    await Promise.all([
      page.waitForURL(/\/dashboard(?:\?.*)?$/),
      page.getByRole('button', { name: /Zarejestruj/i }).click(),
    ]);

    // Strona rejestracji została opuszczona
    await expect(page).toHaveURL(/\/dashboard(?:\?.*)?$/);
  });

});
