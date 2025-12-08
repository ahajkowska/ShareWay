"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import SortControl from "@/app/dashboard/components/SortControl";

import FilterSearchSection from "@/app/dashboard/components/filters/FilterSearchSection";
import QuickFiltersSection from "@/app/dashboard/components/filters/QuickFiltersSection";
import DateRangeSection from "@/app/dashboard/components/filters/DateRangeSection";
import ParticipantsSection from "@/app/dashboard/components/filters/ParticipantsSection";
import type {
  DashboardFiltersSidebarProps,
  FilterState,
} from "@/lib/types/trip";

type TooltipSide = "top" | "right" | "bottom" | "left";
type PanelKey = "search" | "filters" | "sort";

function Tooltip({
  children,
  content,
  side = "right",
}: {
  children: React.ReactNode;
  content: string;
  side?: TooltipSide;
}) {
  const positions: Record<TooltipSide, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    left: "right-full top-1/2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 -translate-y-1/2 ml-1",
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={cn(
          "pointer-events-none absolute whitespace-nowrap rounded-md bg-gray-900 text-white text-[11px] px-2 py-1 shadow-lg z-50",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          positions[side]
        )}
      >
        {content}
      </div>
    </div>
  );
}

export default function DashboardFiltersSidebar({
  t,
  filters,
  advancedFilters,
  hasAdvancedFilters,
  onSearchChange,
  searchOptions,
  onQuickFilterChange,
  onAdvancedFilterChange,
  onReset,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  sortMode,
  onSortChange,
}: DashboardFiltersSidebarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openPanels, setOpenPanels] = useState<PanelKey[]>(["filters"]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.role !== "ALL") count++;
    if (filters.status !== "ALL") count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.minParticipants || filters.maxParticipants) count++;
    return count;
  }, [filters]);

  const searchActive = !!filters.search.trim();
  const quickActive = filters.role !== "ALL" || filters.status !== "ALL";
  const advancedActive =
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.minParticipants ||
    !!filters.maxParticipants;
  const filtersActive = quickActive || advancedActive;
  const sortActive = sortMode !== "newest";
  const anythingActive = searchActive || filtersActive || sortActive;
  const resetSearch = () => onSearchChange("");
  const resetFiltersAll = () => {
    onQuickFilterChange("status", "ALL");
    onQuickFilterChange("role", "ALL");
    onAdvancedFilterChange("dateFrom", "");
    onAdvancedFilterChange("dateTo", "");
    onAdvancedFilterChange("minParticipants", "");
    onAdvancedFilterChange("maxParticipants", "");
  };
  const resetSort = () => onSortChange("newest");
  const resetAll = () => {
    resetSearch();
    resetFiltersAll();
    resetSort();
  };

  const panelButtons = useMemo(
    () => [
      {
        key: "search" as PanelKey,
        label: t.dashboard.filters.searchLabel ?? "Szukaj",
        icon: <Search className="h-4 w-4" />,
        active: searchActive,
      },
      {
        key: "filters" as PanelKey,
        label: t.dashboard.filters.sidebarTitle ?? "Filtry",
        icon: <Filter className="h-4 w-4" />,
        active: filtersActive,
      },
      {
        key: "sort" as PanelKey,
        label: "Sortuj",
        icon: <ArrowUpDown className="h-4 w-4" />,
        active: sortActive,
      },
    ],
    [t, searchActive, filtersActive, sortActive]
  );

  const togglePanel = (panel: PanelKey) => {
    setOpenPanels((prev) => {
      const isOpen = prev.includes(panel);
      const next = isOpen ? prev.filter((p) => p !== panel) : [...prev, panel];

      if (!isOpen && panel === "search") {
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }

      return next;
    });
  };

  const renderPanelContent = (panel: PanelKey) => {
    switch (panel) {
      case "search":
        return (
          <div className="space-y-5">
            <FilterSearchSection
              t={t}
              filters={filters}
              onSearchChange={onSearchChange}
              searchInputRef={searchInputRef}
              suggestionOptions={searchOptions}
            />
          </div>
        );

      case "filters":
        return (
          <div className="space-y-5">
            <QuickFiltersSection
              t={t}
              filters={filters}
              onQuickFilterChange={onQuickFilterChange}
            />

            <div>
              <button
                onClick={() => setShowAdvanced((s) => !s)}
                className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground mt-4 mb-2"
              >
                <span>{t.dashboard.filters.advanced}</span>
                {showAdvanced ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <DateRangeSection
                      t={t}
                      advancedFilters={advancedFilters}
                      onAdvancedFilterChange={onAdvancedFilterChange}
                    />
                    <ParticipantsSection
                      t={t}
                      advancedFilters={advancedFilters}
                      onAdvancedFilterChange={onAdvancedFilterChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case "sort":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground px-1">
              Steruj kolejnością listy podróży.
            </p>
            <div className="max-w-xs">
              <SortControl inline value={sortMode} onChange={onSortChange} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col gap-5 px-3 pb-6 bg-card/70 dark:bg-slate-900/70 backdrop-blur-md border border-border/60 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-2 pt-4 px-1">
        <div className="flex items-center justify-start w-full px-1">
          {!collapsed && !isMobile && (
            <span
              role="button"
              tabIndex={anythingActive ? 0 : -1}
              onClick={() => {
                if (anythingActive) resetAll();
              }}
              onKeyDown={(e) => {
                if (!anythingActive) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  resetAll();
                }
              }}
              className={cn(
                "text-[11px] uppercase tracking-[0.14em] font-semibold select-none transition",
                anythingActive
                  ? "text-primary hover:text-primary/80 cursor-pointer"
                  : "text-muted-foreground cursor-default"
              )}
            >
              Resetuj wszystko
            </span>
          )}
        </div>

        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="h-8 w-8 rounded-xl"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((c) => !c)}
            className="h-8 w-8 rounded-xl"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform text-muted-foreground",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        )}
      </div>

      {(!collapsed || isMobile) && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
          <div className="flex flex-col gap-2 px-1">
            {panelButtons.map((btn) => {
              const isOpen = openPanels.includes(btn.key);
              const isActive = btn.active;
              return (
                <div key={btn.key} className="flex flex-col gap-2">
                  <button
                    onClick={() => togglePanel(btn.key)}
                    aria-pressed={isOpen}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition w-full justify-start",
                      isActive
                        ? "border-primary/60 bg-primary/10 text-primary shadow-[0_8px_30px_-20px_rgba(0,0,0,0.45)]"
                        : cn(
                            "border-border bg-background/60 hover:bg-muted/70 text-foreground",
                            isOpen && "ring-1 ring-border/60 bg-background/70"
                          )
                    )}
                  >
                    {btn.icon}
                    <span className="sr-only">{btn.label}</span>
                    <span className="inline">{btn.label}</span>
                    {isActive && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (btn.key === "search") resetSearch();
                          if (btn.key === "filters") resetFiltersAll();
                          if (btn.key === "sort") resetSort();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            if (btn.key === "search") resetSearch();
                            if (btn.key === "filters") resetFiltersAll();
                            if (btn.key === "sort") resetSort();
                          }
                        }}
                        className="ml-auto text-[10px] uppercase tracking-[0.12em] text-primary hover:underline cursor-pointer select-none"
                      >
                        Resetuj
                      </span>
                    )}
                  </button>

                  {isOpen && (
                    <div className="pl-1 pr-0.5">
                      {renderPanelContent(btn.key)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 64 : 300 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] border-r border-border/70 bg-background/70 backdrop-blur-md"
        >
          {!collapsed ? (
            renderContent(false)
          ) : (
            <div className="flex flex-col items-center py-6 space-y-4">
              {panelButtons.map((btn) => (
                <Tooltip
                  key={btn.key}
                  content={
                    btn.key === "filters"
                      ? `${btn.label} (${activeFiltersCount})`
                      : btn.label
                  }
                  side="right"
                >
                  <button
                    onClick={() => {
                      togglePanel(btn.key);
                      setCollapsed(false);
                    }}
                    className={cn(
                      "relative h-11 w-11 rounded-xl border flex items-center justify-center transition",
                      "bg-background/70 hover:bg-muted/70 border-border text-muted-foreground",
                      btn.active &&
                        "border-primary/60 bg-primary/10 text-primary shadow-[0_8px_30px_-20px_rgba(0,0,0,0.45)]"
                    )}
                  >
                    {btn.icon}
                    {btn.key === "filters" && activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </Tooltip>
              ))}
            </div>
          )}
        </motion.aside>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobileSidebar"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col md:hidden"
          >
            {renderContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
