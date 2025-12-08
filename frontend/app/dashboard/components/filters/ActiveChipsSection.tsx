"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/lib/types/trip";

type Props = {
  t: any;
  filters: FilterState;
  hasAdvancedFilters: boolean;
  onReset: () => void;
  onRemoveFilter?: (key: keyof FilterState) => void;
};

export default function ActiveChipsSection({
  t,
  filters,
  hasAdvancedFilters,
  onReset,
  onRemoveFilter,
}: Props) {
  const chips: {
    id: string;
    label: string;
    key: keyof FilterState;
    className: string;
  }[] = [];

  if (filters.role === "ORGANIZER") {
    chips.push({
      id: "role:organizer",
      key: "role",
      label: t.dashboard.filters.organizer,
      className:
        "bg-violet-50 dark:bg-violet-950/40 border-violet-400/70 text-violet-700 dark:text-violet-100",
    });
  } else if (filters.role === "PARTICIPANT") {
    chips.push({
      id: "role:participant",
      key: "role",
      label: t.dashboard.filters.participant,
      className:
        "bg-sky-50 dark:bg-sky-950/40 border-sky-400/70 text-sky-700 dark:text-sky-100",
    });
  }

  if (filters.dateFrom || filters.dateTo) {
    chips.push({
      id: "meta:dateRange",
      key: "dateFrom",
      label: `${t.dashboard.filters.dateRange}: ${filters.dateFrom || "–"} – ${
        filters.dateTo || "–"
      }`,
      className:
        "bg-sky-50 dark:bg-sky-950/40 border-sky-400/70 text-sky-800 dark:text-sky-100",
    });
  }

  if (filters.minParticipants) {
    chips.push({
      id: "meta:minParticipants",
      key: "minParticipants",
      label: `${t.dashboard.filters.min}: ${filters.minParticipants}`,
      className:
        "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400/70 text-emerald-800 dark:text-emerald-100",
    });
  }

  if (filters.maxParticipants) {
    chips.push({
      id: "meta:maxParticipants",
      key: "maxParticipants",
      label: `${t.dashboard.filters.max}: ${filters.maxParticipants}`,
      className:
        "bg-rose-50 dark:bg-rose-950/40 border-rose-400/70 text-rose-800 dark:text-rose-100",
    });
  }

  if (!hasAdvancedFilters && chips.length === 0) return null;

  return (
    <div className="pt-4 border-t border-border/70 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t.dashboard.filters.activeFiltersLabel ?? "Aktywne filtry"}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-primary hover:underline"
        >
          {t.dashboard.filters.clearAll ?? "Wyczyść wszystkie"}
        </button>
      </div>

      <AnimatePresence>
        <motion.div
          layout
          className="flex flex-wrap gap-1.5 overflow-x-auto scrollbar-none"
        >
          {chips.length === 0 && (
            <span className="text-[12px] text-muted-foreground">
              {t.dashboard.filters.emptyState ?? "Brak aktywnych filtrów."}
            </span>
          )}

          {chips.map((chip) => (
            <motion.div
              key={chip.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
            >
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full border text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1.5 backdrop-blur-sm shadow-sm cursor-pointer hover:brightness-110",
                  chip.className
                )}
              >
                {chip.label}
                <X
                  className="h-3 w-3 ml-1 opacity-60 hover:opacity-100 transition"
                  onClick={() => onRemoveFilter?.(chip.key)}
                />
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
