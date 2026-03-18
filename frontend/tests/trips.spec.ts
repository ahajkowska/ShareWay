import { test, expect } from "@playwright/test";

import { loginAsUser } from "./helpers/e2e";

function buildTrip(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "trip-1",
    name: "Przykładowa podróż",
    destination: "Warszawa, Polska",
    startDate: "2026-01-10T00:00:00.000Z",
    endDate: "2026-01-12T00:00:00.000Z",
    description: "Opis podróży",
    inviteCode: "TRIP12",
    accentPreset: "city",
    members: [
      { id: "m1", name: "Jan Kowalski" },
      { id: "m2", name: "Ania Nowak" },
    ],
    roleForCurrentUser: "ORGANIZER",
    status: "ACTIVE",
    ...overrides,
  };
}

test.describe("Podróże", () => {
  test("ST-TRIPS-02: Wyświetlanie listy podróży użytkownika", async ({
    page,
  }) => {
    await loginAsUser(page);
    let tripsFetched = false;

    await page.route("**/api/v1/trips", async (route) => {
      tripsFetched = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          buildTrip({
            id: "trip-1",
            name: "Majówka w Chorwacji",
            destination: "Split, Chorwacja",
            startDate: "2026-05-01T00:00:00.000Z",
            endDate: "2026-05-05T00:00:00.000Z",
            description: "Weekend z ekipą",
            inviteCode: "CRO123",
          }),
        ]),
      });
    });

    await page.goto("/dashboard");
    await expect.poll(() => tripsFetched).toBeTruthy();

    await expect(page.getByText("Majówka w Chorwacji")).toBeVisible();
    await expect(page.getByText("Split, Chorwacja")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /dodaj podróż/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /dołącz do podróży/i })
    ).toBeVisible();
  });

  test("ST-TRIPS-01: Tworzenie nowej podróży", async ({ page }) => {
    await loginAsUser(page);

    const createdTrip = {
      ...buildTrip({
        id: "trip-created",
        name: "Weekend w Alpach",
        destination: "Zermatt, Szwajcaria",
        startDate: "2026-02-12T00:00:00.000Z",
        endDate: "2026-02-16T00:00:00.000Z",
        description: "Narty i trekking",
        inviteCode: "ALP123",
      }),
    };

    let tripsRequestCount = 0;

    await page.route("**/api/destination-image**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://images.example/alps.jpg" }),
      });
    });

    await page.route("**/api/v1/trips", async (route) => {
      if (route.request().method() === "GET") {
        tripsRequestCount += 1;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(tripsRequestCount > 1 ? [createdTrip] : []),
        });
        return;
      }

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(createdTrip),
      });
    });

    await page.goto("/dashboard");
    await page.getByRole("button", { name: /dodaj podróż/i }).click();

    await page.getByPlaceholder(/wyprawa w alpy/i).fill("Weekend w Alpach");
    await page
      .getByPlaceholder(/zermatt, szwajcaria/i)
      .fill("Zermatt, Szwajcaria");
    await page.locator('input[type="date"]').nth(0).fill("2026-02-12");
    await page.locator('input[type="date"]').nth(1).fill("2026-02-16");
    await page
      .getByPlaceholder(/krótki opis podróży/i)
      .fill("Narty i trekking");
    const createTripRequest = page.waitForRequest(
      (request) =>
        request.url().includes("/api/v1/trips") && request.method() === "POST"
    );
    await page.getByRole("button", { name: /^utwórz podróż$/i }).click();
    const requestBody = JSON.parse((await createTripRequest).postData() ?? "{}");

    expect(requestBody).toEqual({
      name: "Weekend w Alpach",
      description: "Narty i trekking",
      location: "Zermatt, Szwajcaria",
      startDate: "2026-02-12",
      endDate: "2026-02-16",
      baseCurrency: "PLN",
    });

    await expect(page.getByText("Weekend w Alpach")).toBeVisible();
  });
});
