import { cookies } from "next/headers";
import type { AuthUser } from "@/lib/types/auth";

const E2E_AUTH_COOKIE = "__shareway_e2e_auth";

function getE2EUser(cookieValue?: string): AuthUser | null {
  if (process.env.NODE_ENV === "production" || !cookieValue) {
    return null;
  }

  try {
    const decoded = Buffer.from(cookieValue, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<AuthUser>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }

    if (parsed.role && parsed.role !== "user" && parsed.role !== "admin") {
      return null;
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      isActive: true,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

const normalizeApiBase = (base: string) => {
  const trimmed = base.replace(/\/+$/, "");
  if (trimmed.endsWith("/api") || trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
};

const RAW_API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4001/api/v1";
const API_URL = normalizeApiBase(RAW_API_URL);

export async function getCurrentUserServer(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const e2eUser = getE2EUser(cookieStore.get(E2E_AUTH_COOKIE)?.value);

  if (e2eUser) {
    return e2eUser;
  }

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) return null;

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken ?? ""}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();

  return {
    id: data.id,
    name: data.nickname ?? data.name ?? "",
    email: data.email,
    role: data.role,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
