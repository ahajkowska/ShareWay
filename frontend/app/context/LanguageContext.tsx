"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type Lang, type Translations } from "@/lib/i18n";

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const I18nContext = createContext<I18nCtx | null>(null);

type LanguageProviderProps = {
  initialLang: Lang;
  children: ReactNode;
};

export function LanguageProvider({
  initialLang,
  children,
}: LanguageProviderProps) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (l: Lang) => {
    setLangState(l);

    try {
      localStorage.setItem("lang", l);
    } catch {}

    if (typeof document !== "undefined") {
      document.cookie = `lang=${encodeURIComponent(
        l
      )}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.setAttribute("lang", l);
    }
  };

  const t = useMemo(() => dict[lang], [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return ctx;
}
