import { apiUrl, fetchAuth } from "@/lib/api";
import type { AuthUser } from "@/lib/types/auth";

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await fetchAuth<any>(apiUrl("/users/me"), {
      method: "GET",
      cache: "no-store",
    });
    if (!data) return null;
    return {
      id: data.id,
      name: data.nickname ?? data.name ?? "",
      email: data.email,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch {
    return null;
  }
}
