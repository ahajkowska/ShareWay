"use client";

import { useMemo } from "react";
import { CheckCircle, Archive, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterStatus, FilterRole } from "@/lib/types/trip";

type QuickFilterItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  type: "status" | "role";
  value: FilterStatus | FilterRole;
};

type Props = {
  t: any;
  filters: { status: FilterStatus; role: FilterRole };
  onQuickFilterChange: (
    type: "status" | "role",
    value: FilterStatus | FilterRole
  ) => void;
};

export default function QuickFiltersSection({
  t,
  filters,
  onQuickFilterChange,
}: Props) {
  const quickFilters: QuickFilterItem[] = useMemo(
    () => [
      {
        key: "active",
        label: "Aktywne",
        icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
        type: "status",
        value: "ACTIVE",
      },
      {
        key: "archived",
        label: "Archiwum",
        icon: <Archive className="h-4 w-4 text-amber-500" />,
        type: "status",
        value: "ARCHIVED",
      },
      {
        key: "organizer",
        label: "Organizuję",
        icon: <User className="h-4 w-4 text-violet-500" />,
        type: "role",
        value: "ORGANIZER",
      },
      {
        key: "participant",
        label: "Uczestniczę",
        icon: <Users className="h-4 w-4 text-sky-500" />,
        type: "role",
        value: "PARTICIPANT",
      },
    ],
    []
  );

  const isFilterActive = (type: "status" | "role", value: string) => {
    if (type === "status") {
      if (value === "ALL")
        return filters.status === "ALL" && filters.role === "ALL";
      return filters.status === value;
    }
    return filters.role === value;
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Widok podróży
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {quickFilters.map((filter) => {
          const active = isFilterActive(filter.type, filter.value);

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => {
                if (active) {
                  onQuickFilterChange(filter.type, "ALL");
                  return;
                }

                onQuickFilterChange(filter.type, filter.value);
              }}
              className={cn(
                "w-full flex flex-col items-start gap-1 rounded-xl border px-2.5 py-2 text-left transition-all group",
                active
                  ? "border-primary/50 bg-primary/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]"
                  : "border-border/70 bg-muted/10 hover:bg-muted/30"
              )}
            >
              <div className="flex items-start gap-2 text-[11px] text-muted-foreground leading-tight w-full">
                <span
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {filter.icon}
                </span>
                <span className="whitespace-normal wrap-break-word leading-tight line-clamp-2 text-[10px]">
                  {filter.type === "status"
                    ? t.dashboard.filters.quickStatusHint ??
                      "Filtruj po statusie"
                    : t.dashboard.filters.quickRoleHint ?? "Filtruj po roli"}
                </span>
              </div>

              <div className="flex-1 min-w-0 leading-tight pr-3">
                <p
                  className={cn(
                    "text-[12px] font-semibold whitespace-normal",
                    active ? "text-primary" : "text-foreground"
                  )}
                >
                  {filter.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
