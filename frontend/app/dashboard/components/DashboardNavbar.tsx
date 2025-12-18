"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import LanguageToggle from "@/app/components/LanguageToggle";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import Logo from "@/app/components/Logo";
import { useI18n } from "@/app/context/LanguageContext";
import { logoutUser } from "@/lib/auth/logout";
import { toast } from "sonner";
import type { AuthUser } from "@/lib/types/auth";

export default function DashboardNavbar({
  user,
}: {
  user?: AuthUser;
}) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useI18n();
  const router = useRouter();

  const resolvedUser =
    user ?? {
      id: "guest",
      name: "Demo User",
      email: "demo@shareway.app",
    };

  const logoutLabel = t.nav.logout;
  const settingsLabel = t.nav.settings;
  const profileLabel = t.nav.profile;
  const initials =
    resolvedUser.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();

      toast.success(t.auth.toast.logoutSuccess, {
        description: resolvedUser.email,
        duration: 2000,
      });

      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);

      toast.error(
        lang === "pl"
          ? "Nie udało się wylogować. Spróbuj ponownie."
          : "Failed to log out. Please try again.",
        { duration: 2000 }
      );

      router.push("/");
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Logo className="h-8 w-8 sm:h-9 sm:w-9 transition-transform group-hover:scale-110" />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t.brand}
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="relative inline-flex items-center justify-center rounded-full bg-background/70 p-0.5 hover:bg-muted/60 transition"
              aria-label="User menu"
            >
              <Avatar>
                <AvatarFallback className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-white text-[11px] sm:text-[12px] ring-2 ring-border/60 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] overflow-hidden transition-transform hover:scale-110 bg-amber-400 dark:bg-sky-600">
                  <span className="relative z-10 drop-shadow-sm tracking-wide">
                    {initials}
                  </span>
                </AvatarFallback>
              </Avatar>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-60 rounded-2xl border border-border/70 bg-popover/95 shadow-2xl ring-1 ring-primary/10 backdrop-blur-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-border/70 bg-linear-to-r from-primary/8 via-transparent to-secondary/10">
                    <p className="text-sm font-semibold text-foreground">
                      {resolvedUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {resolvedUser.email}
                    </p>
                  </div>

                  <nav className="flex flex-col py-1">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/70 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="h-4 w-4 text-muted-foreground" />{" "}
                      <span className="text-foreground">{profileLabel}</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/70 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />{" "}
                      <span className="text-foreground">{settingsLabel}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border/70"
                    >
                      <LogOut className="h-4 w-4" /> {logoutLabel}
                    </button>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/70 transition hover:bg-muted/60"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sm:hidden fixed top-16 left-0 right-0 bg-background border-b border-border shadow-md"
          >
            <nav className="flex flex-col divide-y divide-border">
              <Link
                href="/dashboard/profile"
                className="px-6 py-4 text-lg hover:bg-muted/60 transition"
                onClick={() => setOpen(false)}
              >
                {profileLabel}
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-6 py-4 text-lg hover:bg-muted/60 transition"
                onClick={() => setOpen(false)}
              >
                {settingsLabel}
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-4 text-lg text-destructive hover:bg-destructive/10 transition text-left"
              >
                {logoutLabel}
              </button>

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
