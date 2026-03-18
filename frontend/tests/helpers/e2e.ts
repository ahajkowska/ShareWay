import type { Page } from "@playwright/test";

const E2E_AUTH_COOKIE = "__shareway_e2e_auth";

export const E2E_USER = {
  id: "e2e-user",
  name: "Jan Kowalski",
  email: "test@shareway.com",
  role: "user",
} as const;

export async function loginAsUser(page: Page) {
  const value = Buffer.from(JSON.stringify(E2E_USER)).toString("base64url");

  await page.context().addCookies([
    {
      name: E2E_AUTH_COOKIE,
      value,
      url: "http://localhost:3000",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
