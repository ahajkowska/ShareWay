"use client";

export function useExplainRegisterError() {
  const explainRegisterError = (err: any, isPL: boolean): string => {
    const text = (err?.code || err?.message || "").toString();
    if (/exists|in use/i.test(text))
      return isPL ? "Ten e-mail jest już zajęty" : "Email is already in use";
    if (/weak/i.test(text))
      return isPL ? "Hasło jest zbyt słabe" : "Password is too weak";
    return isPL
      ? "Nie udało się utworzyć konta. Spróbuj ponownie."
      : "Could not create the account. Please try again.";
  };

  return { explainRegisterError };
}
