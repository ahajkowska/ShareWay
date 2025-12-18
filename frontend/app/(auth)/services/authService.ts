"use server";

import { AuthCredentials, RegisterData, AuthUser } from "@/lib/types/auth";

export async function loginUser({
  email,
  password,
}: AuthCredentials): Promise<AuthUser> {
  console.log("loginUser() called", { email, password });

  return {
    id: "TEMP-ID",
    name: "Demo User",
    email,
  };
}

export async function registerUser(data: RegisterData): Promise<AuthUser> {
  console.log("registerUser() called", data);

  return {
    id: "NEW-USER-ID",
    name: data.nickname,
    email: data.email,
  };
}

export async function logoutUser(): Promise<void> {
  console.log("logoutUser() called");
}
