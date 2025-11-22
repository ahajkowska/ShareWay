"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "@/app/context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t, lang } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const loginLabel = t?.nav?.login ?? (lang === "pl" ? "Zaloguj" : "Log in");
  const signupLabel =
    t?.nav?.signup ?? (lang === "pl" ? "Rejestracja" : "Sign up");

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="h-8 w-8 sm:h-9 sm:w-9 transition-transform group-hover:scale-110" />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t?.brand ?? "ShareWay"}
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />

          <Link href="/login">
            <Button
              variant="ghost"
              className="h-10 px-4 text-sm rounded-full hover:-translate-y-px transition-transform"
            >
              {loginLabel}
            </Button>
          </Link>

          <Link href="/register">
            <Button className="h-10 px-5 text-sm rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ring-1 ring-black/5 dark:ring-white/10">
              {signupLabel}
            </Button>
          </Link>
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-label={
              open
                ? lang === "pl"
                  ? "Zamknij menu"
                  : "Close menu"
                : lang === "pl"
                ? "Otwórz menu"
                : "Open menu"
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/70 transition hover:bg-muted/60"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-fullwidth"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-md"
          >
            <nav className="flex flex-col divide-y divide-border">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="w-full px-6 py-4 text-lg font-medium text-foreground hover:bg-muted/60 hover:text-primary transition-colors"
              >
                {signupLabel}
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full px-6 py-4 text-lg font-medium text-foreground hover:bg-muted/60 hover:text-primary transition-colors"
              >
                {loginLabel}
              </Link>

              <div className="px-6 py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {lang === "pl" ? "Język interfejsu" : "Interface language"}
                </p>
                <LanguageToggle mode="menu" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
