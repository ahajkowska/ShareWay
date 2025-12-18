"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/lib/types/auth";
import { fetchAuth, apiUrl, AuthError } from "@/lib/api";

type SessionState = {
  user: AuthUser | null;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

type SessionProviderProps = {
  initialUser?: AuthUser | null;
  children: React.ReactNode;
};

export function SessionProvider({
  initialUser = null,
  children,
}: SessionProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const [error, setError] = useState<string | undefined>(undefined);

  const refresh = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const profile = await fetchAuth<AuthUser | null>(apiUrl("/users/me"), {
        method: "GET",
        cache: "no-store",
      });
      setUser(profile ?? null);
    } catch (err) {
      if (
        err instanceof AuthError &&
        (err.status === 401 || err.status === 403)
      ) {
        setUser(null);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUser) {
      setLoading(false);
      return;
    }
    void refresh();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refresh,
      setUser,
    }),
    [user, loading, error]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
