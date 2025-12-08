"use client";

import { useState, useMemo } from "react";
import type { FilterState, Trip } from "@/lib/types/trip";
import { normalizeSearchText } from "@/lib/utils";

export function useFilters(trips: Trip[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "ALL",
    role: "ALL",
    dateFrom: "",
    dateTo: "",
    location: "",
    minParticipants: "",
    maxParticipants: "",
  });

  const advancedFilters = {
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    minParticipants: filters.minParticipants,
    maxParticipants: filters.maxParticipants,
  };

  const hasAdvancedFilters =
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.minParticipants ||
    !!filters.maxParticipants;

  const filteredTrips = useMemo(() => {
    let list = trips;

    if (filters.search) {
      const s = normalizeSearchText(filters.search);
      list = list.filter(
        (t) =>
          [t.name, t.destination, t.description ?? "", t.inviteCode ?? ""]
            .concat(t.members?.map((m) => m.name) ?? [])
            .some((field) => normalizeSearchText(field).includes(s))
      );
    }

    return list;
  }, [filters, trips]);

  const resetFilters = () =>
    setFilters({
      search: "",
      status: "ALL",
      role: "ALL",
      dateFrom: "",
      dateTo: "",
      location: "",
      minParticipants: "",
      maxParticipants: "",
    });

  return {
    filters,
    setFilters,
    advancedFilters,
    hasAdvancedFilters,
    filteredTrips,
    resetFilters,
  };
}
