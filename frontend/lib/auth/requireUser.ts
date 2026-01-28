import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/lib/auth/server";

export async function requireUser(redirectTo: string = "/dashboard") {
  const user = await getCurrentUserServer();
  if (!user) {
    const target = encodeURIComponent(redirectTo);
    redirect(`/login?from=${target}`);
  }
  return user;
}
