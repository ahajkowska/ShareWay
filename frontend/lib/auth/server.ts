import { cookies, headers } from "next/headers";
import type { ApiUser } from "@/lib/auth/api";
import { apiUrl } from "@/lib/api";
import type { AuthUser } from "@/lib/types/auth";
import { buildAuthError, mapApiUser, readJson } from "./api";

export async function getCurrentUserServer(): Promise<AuthUser | null> {
  let sessionCookies = "";

  try {
    const cookieStore = await cookies();
    if (cookieStore && typeof (cookieStore as any).get === "function") {
      sessionCookies = ["access_token", "refresh_token"]
        .map((name) => cookieStore.get(name as any))
        .filter(Boolean)
        .map((cookie) => `${cookie!.name}=${cookie!.value}`)
        .join("; ");
    }
  } catch {}

  if (!sessionCookies) {
    try {
      const headerList = await headers();
      const raw =
        typeof (headerList as any)?.get === "function"
          ? (headerList as any).get("cookie")
          : (headerList as any)?.cookie;
      if (raw) sessionCookies = raw as string;
    } catch {}
  }

  if (!sessionCookies) return null;

  const response = await fetch(apiUrl("/users/me"), {
    method: "GET",
    headers: { cookie: sessionCookies },
    credentials: "include",
    cache: "no-store",
  });

  const data = await readJson(response);

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw buildAuthError(response, data);
  }

  if (!data) {
    return null;
  }

  return mapApiUser(data as ApiUser);
}
