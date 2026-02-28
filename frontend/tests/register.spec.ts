import { test, expect } from '@playwright/test';

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

    // Wpisanie 1 znaku i opuszczenie pola
    await page.locator('#reg-name').fill('A');
    await page.locator('#reg-email').click();

    // Komunikat walidacji imienia ma się pojawić
    await expect(page.locator('#reg-name-error')).toBeVisible();
    await expect(page.getByText(/co najmniej/i)).toBeVisible();
  });

  test('Walidacja – hasła nie są identyczne', async ({ page }) => {
    await page.goto('/register');

    await page.locator('#reg-password').fill('Test123!');
    await page.locator('#reg-confirm').fill('Inne456!');
    await page.locator('#reg-name').click();

    // Błąd zgodności haseł
    await expect(page.locator('#reg-confirm-error')).toBeVisible();
    await expect(page.getByText(/nie są identyczne/i)).toBeVisible();
  });

  test('Walidacja formatu e-mail', async ({ page }) => {
    await page.goto('/register');

    await page.locator('#reg-email').fill('zly-email');
    await page.locator('#reg-name').click();

    await expect(page.locator('#reg-email-error')).toBeVisible();
    await expect(page.getByText(/Nieprawidłowy format/i)).toBeVisible();
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

    await page.locator('#reg-name').fill('Jan Kowalski');
    await page.locator('#reg-email').fill('zajety@example.com');
    await page.locator('#reg-password').fill('Test123!');
    await page.locator('#reg-confirm').fill('Test123!');
    await page.locator('input[type="checkbox"]').check();

    await page.getByRole('button', { name: /Zarejestruj/i }).click();

    // Komunikat o zajętym e-mailu
    await expect(page.getByText(/Ten e-mail jest już zajęty/i)).toBeVisible();
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

    await page.locator('#reg-name').fill('Jan Kowalski');
    await page.locator('#reg-email').fill('jan@shareway.com');
    await page.locator('#reg-password').fill('Test123!');
    await page.locator('#reg-confirm').fill('Test123!');
    await page.locator('input[type="checkbox"]').check();

    await page.getByRole('button', { name: /Zarejestruj/i }).click();

    // Strona rejestracji została opuszczona
    await expect(page).not.toHaveURL(/\/register/);
  });

});
