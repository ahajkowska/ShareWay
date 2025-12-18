import { redirect } from "next/navigation";
import { getCurrentUserServer } from "./server";
import type { AuthUser } from "@/lib/types/auth";

export async function requireUser(redirectFrom: string = "/dashboard"): Promise<AuthUser> {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect(`/login?from=${encodeURIComponent(redirectFrom)}`);
  }

  return user!;
}
