"use server";

import { cookies } from "next/headers";
import { AuthCredentials, RegisterData, AuthUser } from "@/lib/types/auth";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4000/api/v1";

export async function loginUser({
  email,
  password,
}: AuthCredentials): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Login failed");
  }

  // Extract and forward cookies
  const cookieStore = await cookies();
  const setCookieHeaders = response.headers.getSetCookie();

  for (const cookieHeader of setCookieHeaders) {
    const [cookiePart] = cookieHeader.split(";");
    const [name, value] = cookiePart.split("=");
    if (name && value) {
      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  }

  // Fetch user profile
  const userResponse = await fetch(`${API_URL}/users/me`, {
    headers: { Cookie: setCookieHeaders.join("; ") },
    credentials: "include",
  });

  if (!userResponse.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const user = await userResponse.json();

  return {
    id: user.id,
    name: user.nickname,
    email: user.email,
  };
}

export async function registerUser(data: RegisterData): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      nickname: data.name,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Registration failed" }));
    throw new Error(error.message || "Registration failed");
  }

  // Auto-login after successful registration
  return loginUser({ email: data.email, password: data.password });
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  // Always clear cookies on client side
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
