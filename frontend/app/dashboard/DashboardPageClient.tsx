"use client";

import DashboardFiltersSidebar from "@/app/dashboard/components/filters/DashboardFiltersSidebar";
import TripCard from "@/app/dashboard/components/TripCard";
import { tripsMock } from "@/app/dashboard/hooks/useTripsMock";
import { useSidebar } from "@/app/dashboard/hooks/useSidebar";
import { useFilteredTrips } from "@/app/dashboard/hooks/useFilteredTrips";
import SortControl from "@/app/dashboard/components/SortControl";
import { useDashboardState } from "@/app/dashboard/hooks/useDashboardState";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

const t = {
  dashboard: {
    filters: {
      sidebarTitle: "Filtry",
      sidebarSubtitle: "Zawężaj listę podróży",
      searchLabel: "Wyszukiwanie",
      quickFiltersGroupLabel: "Widok podróży",
      reset: "Resetuj",
      clearAll: "Wyczyść wszystkie",
      activeFiltersLabel: "Aktywne filtry",
      advanced: "Zaawansowane",
      buttonLabel: "Filtry",
      from: "Od",
      to: "Do",
      location: "Lokalizacja",
      locationPlaceholder: "np. Chorwacja",
      participantsCount: "Liczba uczestników",
      min: "Min.",
      max: "Maks.",
      dateRange: "Zakres dat",
    },
  },
};

export default function DashboardPageClient({
  initialSidebarOpen,
}: {
  initialSidebarOpen: boolean;
}) {
  const {
    filters,
    setFilters,
    sortMode,
    setSortMode,
    resetFilters,
    advancedFilters,
    hasAdvancedFilters,
  } = useDashboardState();

  const { isSidebarOpen, setIsSidebarOpen, isMobile, sidebarWidth } =
    useSidebar(initialSidebarOpen);

  const filteredTrips = useFilteredTrips(tripsMock, filters, sortMode);

  const navGutter = 16; // px-4 from navbar
  const navMargin = `calc((100vw - min(100vw, 1280px))/2 + ${navGutter}px)`;
  const leftPad = isMobile
    ? `${navGutter}px`
    : `calc(${sidebarWidth}px + ${navGutter + 48}px)`;

  return (
    <div className="relative min-h-screen flex bg-background text-foreground">
      {/* SIDEBAR — desktop/tablet */}
      {!isMobile && (
        <DashboardFiltersSidebar
          t={t}
          filters={filters}
          advancedFilters={advancedFilters}
          hasAdvancedFilters={hasAdvancedFilters}
          onSearchChange={(v) => setFilters({ ...filters, search: v })}
          onQuickFilterChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onAdvancedFilterChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onReset={resetFilters}
          collapsed={!isSidebarOpen}
          // setCollapsed dostaje stan docelowy
          setCollapsed={(collapsed) => setIsSidebarOpen(!collapsed)}
          mobileOpen={false}
          setMobileOpen={setIsSidebarOpen}
        />
      )}

      {/* SIDEBAR — mobile */}
      {isMobile && (
        <DashboardFiltersSidebar
          t={t}
          filters={filters}
          advancedFilters={advancedFilters}
          hasAdvancedFilters={hasAdvancedFilters}
          onSearchChange={(v) => setFilters({ ...filters, search: v })}
          onQuickFilterChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onAdvancedFilterChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onReset={resetFilters}
          collapsed={false}
          setCollapsed={() => {}}
          mobileOpen={isSidebarOpen}
          setMobileOpen={setIsSidebarOpen}
        />
      )}

      {/* MAIN CONTENT */}
      <main className={cn("flex-1 pt-20 pb-10 transition-all duration-300")}>
        <div
          className="w-full space-y-6"
          style={{
            paddingInlineStart: leftPad,
            paddingInlineEnd: navMargin,
          }}
        >
          <SortControl value={sortMode} onChange={setSortMode} />

          {/* GRID OF TRIPS */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={index}
                onOpen={(id) => console.log("Open trip", id)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* FLOATING FILTER BUTTON (mobile) */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium shadow-sm active:scale-95 transition"
        >
          <Filter className="h-4 w-4" />
          Filtry
        </button>
      )}
    </div>
  );
}
