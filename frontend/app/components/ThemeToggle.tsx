"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Przełącz motyw"
      className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                 bg-amber-200/70 shadow-inner dark:bg-primary/90 dark:shadow-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span
        className="absolute top-0.5 left-0.5 flex items-center justify-center h-7 w-7 rounded-full shadow-md
                   transform transition-transform duration-300
                   bg-white text-amber-500 dark:bg-zinc-800 dark:text-blue-100
                   translate-x-0 dark:translate-x-6"
      >
        <Sun className="h-4 w-4 inline dark:hidden" />
        <Moon className="h-4 w-4 hidden dark:inline" />
      </span>
    </button>
  );
}
