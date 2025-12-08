"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sidebar-open";

export function useSidebar(initialOpen: boolean) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialOpen);

  useEffect(() => {
    const syncState = () => {
      const mobileNow = window.innerWidth < 768;
      setIsMobile(mobileNow);

      if (mobileNow) {
        setIsSidebarOpen(false);
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsSidebarOpen(stored === "true");
      }
    };

    syncState();
    window.addEventListener("resize", syncState);
    return () => window.removeEventListener("resize", syncState);
  }, [initialOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isSidebarOpen));
    document.cookie = `${STORAGE_KEY}=${String(
      isSidebarOpen
    )}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, [isSidebarOpen]);

  const sidebarWidth = useMemo(
    () => (isMobile ? 0 : isSidebarOpen ? 280 : 70),
    [isMobile, isSidebarOpen]
  );

  return { isMobile, isSidebarOpen, setIsSidebarOpen, sidebarWidth };
}
