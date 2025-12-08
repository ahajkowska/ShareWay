"use client";

import { useMemo } from "react";
import type { Trip, FilterState } from "@/lib/types/trip";
import type { SortMode } from "@/app/dashboard/components/SortControl";
import { normalizeSearchText } from "@/lib/utils";

export function useFilteredTrips(
  trips: Trip[],
  filters: FilterState,
  sortMode: SortMode
) {
  return useMemo(() => {
    let list = [...trips];

    const searchTerm = normalizeSearchText(filters.search);
    if (searchTerm) {
      list = list.filter(
        (t) =>
          [t.name, t.destination, t.description ?? "", t.inviteCode ?? ""]
            .concat(t.members?.map((m) => m.name) ?? [])
            .some((field) =>
              normalizeSearchText(field).includes(searchTerm)
            )
      );
    }

    if (filters.status !== "ALL") {
      list = list.filter((t) => t.status === filters.status);
    }

    if (filters.role !== "ALL") {
      list = list.filter((t) => t.roleForCurrentUser === filters.role);
    }

    const fromTime = filters.dateFrom ? Date.parse(filters.dateFrom) : NaN;
    const toTime = filters.dateTo ? Date.parse(filters.dateTo) : NaN;
    const hasFrom = Number.isFinite(fromTime);
    const hasTo = Number.isFinite(toTime);

    if (hasFrom || hasTo) {
      list = list.filter((t) => {
        const start = Date.parse(t.startDate);
        const end = Date.parse(t.endDate);

        if (hasFrom && end < fromTime) return false;
        if (hasTo && start > toTime) return false;
        return true;
      });
    }

    const minP = filters.minParticipants
      ? parseInt(filters.minParticipants, 10)
      : NaN;
    const maxP = filters.maxParticipants
      ? parseInt(filters.maxParticipants, 10)
      : NaN;

    if (Number.isFinite(minP) || Number.isFinite(maxP)) {
      list = list.filter((t) => {
        const count = t.members?.length ?? 0;
        if (Number.isFinite(minP) && count < minP) return false;
        if (Number.isFinite(maxP) && count > maxP) return false;
        return true;
      });
    }

    list.sort((a, b) => {
      if (a.status === "ARCHIVED" && b.status !== "ARCHIVED") return 1;
      if (a.status !== "ARCHIVED" && b.status === "ARCHIVED") return -1;

      switch (sortMode) {
        case "newest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "oldest":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "a-z":
          return a.name.localeCompare(b.name);
        case "z-a":
          return b.name.localeCompare(a.name);
        case "participants":
          return (b.members?.length ?? 0) - (a.members?.length ?? 0);
        default:
          return 0;
      }
    });

    return list;
  }, [trips, filters, sortMode]);
}
