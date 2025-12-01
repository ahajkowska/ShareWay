"use client";

export function useExplainLoginError() {
  const explainLoginError = (err: any, t: any): string => {
    const text = (err?.code || err?.message || "").toString();
    if (/network|fetch|timeout/i.test(text)) return t.auth.login.errors.network;
    return t.auth.login.errors.invalidCredentials;
  };
  return { explainLoginError };
}
