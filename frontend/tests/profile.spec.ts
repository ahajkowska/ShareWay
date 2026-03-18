import { test, expect } from "@playwright/test";

import { loginAsUser } from "./helpers/e2e";

test.describe("Profil użytkownika", () => {
  test("ST-PROF-01: Wyświetlanie danych profilu", async ({ page }) => {
    await loginAsUser(page);

    const initialProfile = {
      id: "e2e-user",
      email: "test@shareway.com",
      nickname: "Jan Kowalski",
      isActive: true,
      createdAt: "2025-01-10T12:00:00.000Z",
      updatedAt: "2025-02-10T12:00:00.000Z",
    };

    await page.route("**/api/v1/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(initialProfile),
      });
    });

    await page.goto("/dashboard/profile");

    await expect(
      page.getByRole("heading", { name: /twój profil/i })
    ).toBeVisible();
    await expect(page.getByText("Jan Kowalski")).toBeVisible();
    await expect(page.locator('input[disabled]').first()).toHaveValue(
      "test@shareway.com"
    );
  });
});
