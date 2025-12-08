"use client";

import {
  useLayoutEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { FilterState } from "@/lib/types/trip";
import type { SortMode } from "@/app/dashboard/components/SortControl";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "ALL",
  role: "ALL",
  dateFrom: "",
  dateTo: "",
  location: "",
  minParticipants: "",
  maxParticipants: "",
};

export function useDashboardState() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const storedFilters = localStorage.getItem("dashboard-filters");
    const storedSort = localStorage.getItem("dashboard-sort");

    if (storedFilters) {
      try {
        const parsed = JSON.parse(storedFilters) as FilterState;
        setFilters(parsed);
      } catch {
        setFilters(DEFAULT_FILTERS);
      }
    }

    if (
      storedSort === "newest" ||
      storedSort === "oldest" ||
      storedSort === "a-z" ||
      storedSort === "z-a" ||
      storedSort === "participants"
    ) {
      setSortMode(storedSort);
    }

    setHydrated(true);
  }, []);

  useLayoutEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("dashboard-filters", JSON.stringify(filters));
    localStorage.setItem("dashboard-sort", sortMode);
  }, [filters, sortMode, hydrated]);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const advancedFilters = useMemo(
    () => ({
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      minParticipants: filters.minParticipants,
      maxParticipants: filters.maxParticipants,
    }),
    [filters]
  );

  const hasAdvancedFilters = useMemo(
    () => Object.values(advancedFilters).some((v) => v !== ""),
    [advancedFilters]
  );

  return {
    filters,
    setFilters,
    sortMode,
    setSortMode,
    resetFilters,
    hydrated,
    advancedFilters,
    hasAdvancedFilters,
  };
}
