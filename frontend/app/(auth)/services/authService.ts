import { AuthCredentials, RegisterData, AuthUser } from "@/lib/types/auth";

const normalizeApiBase = (base: string) => {
  const trimmed = base.replace(/\/+$/, "");
  if (trimmed.endsWith("/api") || trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
};

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const API_URL = normalizeApiBase(RAW_API_URL);

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

  // Fetch user profile (cookies from login response are stored by the browser)
  const userResponse = await fetch(`${API_URL}/users/me`, {
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
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
