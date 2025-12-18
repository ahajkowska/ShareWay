import { apiUrl, fetchAuth, AuthError } from "@/lib/api";
import type { AuthCredentials, RegisterData, AuthUser } from "@/lib/types/auth";

export type ApiUser = {
  id: string;
  email: string;
  nickname: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function mapApiUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.nickname ?? apiUser.email,
    isActive: apiUser.isActive,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
}

export async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function buildAuthError(response: Response, data: any) {
  const normalizedMessage =
    (Array.isArray(data?.message) ? data.message.join(", ") : data?.message) ??
    data?.error ??
    (typeof data === "string" ? data : undefined) ??
    `Request failed with status ${response.status}`;

  return new AuthError(normalizedMessage, response.status);
}

export async function loginUser({
  email,
  password,
}: AuthCredentials): Promise<AuthUser> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw buildAuthError(response, data);
  }

  const profile = await fetchCurrentUser();
  if (!profile) {
    throw new AuthError("Logged in but failed to load profile", 500);
  }

  return profile;
}

export async function registerUser(data: RegisterData): Promise<string> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    }),
    cache: "no-store",
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw buildAuthError(response, payload);
  }

  if (payload && typeof payload === "object" && "message" in payload) {
    return (payload as { message: string }).message;
  }

  return "Registration successful";
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(apiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return;
  }

  if (!response.ok) {
    const data = await readJson(response);
    throw buildAuthError(response, data);
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await fetchAuth<ApiUser | null>(apiUrl("/users/me"), {
      method: "GET",
      cache: "no-store",
    });

    if (!data) return null;

    return mapApiUser(data);
  } catch (error) {
    if (
      error instanceof AuthError &&
      (error.status === 401 || error.status === 403)
    ) {
      return null;
    }
    throw error;
  }
}
