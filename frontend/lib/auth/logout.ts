const normalizeApiBase = (base: string) => {
  const trimmed = base.replace(/\/+$/, "");
  if (trimmed.endsWith("/api") || trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
};

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1";
const API_URL = normalizeApiBase(RAW_API_URL);

export async function logoutUser(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
