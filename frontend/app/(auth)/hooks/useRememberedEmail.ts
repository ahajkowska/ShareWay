"use client";

import { useEffect, useState } from "react";

export function useRememberedEmail(key = "auth-remember-email") {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const flag = localStorage.getItem(`${key}:flag`);
    const value = localStorage.getItem(`${key}:value`);
    setRemember(flag === "1");
    setEmail(value || "");
  }, [key]);

  const update = (flag: boolean, value: string) => {
    setRemember(flag);
    setEmail(value);
    localStorage.setItem(`${key}:flag`, flag ? "1" : "0");
    if (flag) localStorage.setItem(`${key}:value`, value);
    else localStorage.removeItem(`${key}:value`);
  };

  return { remember, email, update };
}
