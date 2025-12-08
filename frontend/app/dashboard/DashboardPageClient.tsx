"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DashboardFiltersSidebar from "@/app/dashboard/components/filters/DashboardFiltersSidebar";
import TripCard from "@/app/dashboard/components/TripCard";
import { useTrips } from "@/app/dashboard/hooks/useTrips";
import { useSidebar } from "@/app/dashboard/hooks/useSidebar";
import { useFilteredTrips } from "@/app/dashboard/hooks/useFilteredTrips";
import { useDashboardState } from "@/app/dashboard/hooks/useDashboardState";
import { cn, normalizeSearchText } from "@/lib/utils";
import { SlidersHorizontal, SearchX, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

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

  const {
    trips,
    loading: tripsLoading,
    error: tripsError,
    reload: reloadTrips,
  } = useTrips();

  const filteredTrips = useFilteredTrips(trips, filters, sortMode);
  const searchActive = filters.search.trim().length > 0;
  const filtersActive =
    filters.status !== "ALL" ||
    filters.role !== "ALL" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minParticipants ||
    filters.maxParticipants;
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [createImage, setCreateImage] = useState<string | null>(null);
  const [createImageLoading, setCreateImageLoading] = useState(false);
  const searchOptions = useMemo(() => {
    const seen = new Map<string, string>();

    trips.forEach((trip) => {
      [trip.name, trip.destination, trip.description ?? ""].forEach((value) => {
        const normalized = normalizeSearchText(value);
        if (normalized && !seen.has(normalized)) {
          seen.set(normalized, value);
        }

        value
          .split(",")
          .map((part) => part.trim())
          .forEach((part) => {
            const normalizedPart = normalizeSearchText(part);
            if (normalizedPart && !seen.has(normalizedPart)) {
              seen.set(normalizedPart, part);
            }
          });
      });
    });

    return Array.from(seen.values());
  }, [trips]);

  const getAccentPresetFromText = (text: string) => {
    const lower = normalizeSearchText(text);
    if (/beach|sea|ocean|coast|island|tropical|morze|plaza/.test(lower)) {
      return "beach";
    }
    if (/mountain|alps|hiking|peak|ski|gory|tatry|zakopane/.test(lower)) {
      return "mountains";
    }
    if (
      /city|urban|downtown|metro|miasto|barcelona|paris|tokio|japonia|japan/.test(
        lower
      )
    ) {
      return "city";
    }
    if (/desert|sahara|dune|pustyn/.test(lower)) return "desert";
    if (/tropic|island|bali|hawai|palma/.test(lower)) return "tropical";
    if (/winter|snow|ski|zima|lodow|iceland/.test(lower)) return "winter";
    if (/lake|jezior|mazury|fjord/.test(lower)) return "lake";
    if (/village|countryside|farm|wies|wiejski/.test(lower))
      return "countryside";
    if (/camp|adventure|forest|oboz|biwak/.test(lower)) return "adventure";
    return "neutral";
  };

  useEffect(() => {
    if (!createOpen) return;
    const destination = createForm.destination.trim();
    if (!destination) {
      setCreateImage(null);
      setCreateImageLoading(false);
      return;
    }

    const controller = new AbortController();
    const norm = normalizeSearchText(destination);
    const preset = getAccentPresetFromText(destination);

    const polishToEnglish: Record<string, string> = {
      japonia: "Japan",
      tokio: "Tokyo",
      hiszpania: "Spain",
      chorwacja: "Croatia",
      wlochy: "Italy",
      włochy: "Italy",
      francja: "France",
      grecja: "Greece",
      niemcy: "Germany",
      szwajcaria: "Switzerland",
      czechy: "Czech Republic",
      praga: "Prague",
      barcelona: "Barcelona Spain",
      paryz: "Paris France",
      paryż: "Paris France",
      bali: "Bali Indonesia",
      islandia: "Iceland",
      norwegia: "Norway",
      mazury: "Masurian lakes Poland",
    };

    const englishHint = Object.entries(polishToEnglish).find(([pl]) =>
      norm.includes(normalizeSearchText(pl))
    )?.[1];

    const [cityRaw, ...rest] = destination.split(",").map((p) => p.trim());
    const countryRaw = rest.join(" ").trim();
    const normCity = normalizeSearchText(cityRaw || "");
    const normCountry = normalizeSearchText(countryRaw || "");

    const englishCityHint = Object.entries(polishToEnglish).find(([pl]) =>
      normCity.includes(normalizeSearchText(pl))
    )?.[1];
    const englishCountryHint = Object.entries(polishToEnglish).find(([pl]) =>
      normCountry.includes(normalizeSearchText(pl))
    )?.[1];

    const queries: string[] = [];
    if (englishCityHint && englishCountryHint) {
      queries.push(`${englishCityHint} ${englishCountryHint}`);
      queries.push(`${englishCountryHint} ${englishCityHint}`);
    }
    if (englishCityHint && countryRaw)
      queries.push(`${englishCityHint} ${countryRaw}`);
    if (cityRaw && englishCountryHint)
      queries.push(`${cityRaw} ${englishCountryHint}`);
    if (englishCountryHint && cityRaw)
      queries.push(`${englishCountryHint} ${cityRaw}`);
    if (countryRaw && englishCityHint)
      queries.push(`${countryRaw} ${englishCityHint}`);
    if (englishHint) queries.push(englishHint);
    if (englishCityHint) queries.push(englishCityHint);
    if (englishCountryHint) queries.push(englishCountryHint);
    if (cityRaw && countryRaw) queries.push(`${cityRaw} ${countryRaw}`);
    if (countryRaw && cityRaw) queries.push(`${countryRaw} ${cityRaw}`);
    queries.push(destination);
    if (norm) queries.push(norm);

    const uniqueQueries = Array.from(new Set(queries.filter(Boolean)));

    const load = async () => {
      setCreateImageLoading(true);
      for (const q of uniqueQueries) {
        if (controller.signal.aborted) break;
        const params = new URLSearchParams({ q, preset, stable: "1" });
        try {
          const res = await fetch(
            `/api/destination-image?${params.toString()}`,
            {
              signal: controller.signal,
            }
          );
          if (!res.ok) continue;
          const data = (await res.json()) as { url?: string };
          if (data?.url) {
            setCreateImage(data.url);
            break;
          }
        } catch (err) {
          const error = err as { name?: string };
          if (error?.name === "AbortError") break;
        }
      }
      if (!controller.signal.aborted) {
        setCreateImageLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [createForm.destination, createOpen]);

  const navGutter = 16;
  const navMargin = `calc((100vw - min(100vw, 1280px))/2 + ${navGutter}px)`;
  const leftPad = isMobile
    ? `${navGutter}px`
    : `calc(${sidebarWidth}px + ${navGutter + 48}px)`;

  return (
    <div className="relative min-h-screen flex bg-background text-foreground">
      {!isMobile && (
        <DashboardFiltersSidebar
          t={t}
          filters={filters}
          advancedFilters={advancedFilters}
          hasAdvancedFilters={hasAdvancedFilters}
          sortMode={sortMode}
          onSortChange={setSortMode}
          searchOptions={searchOptions}
          onSearchChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              search: v,
            }))
          }
          onQuickFilterChange={(k, v) =>
            setFilters((prev) => ({
              ...prev,
              [k]: v,
            }))
          }
          onAdvancedFilterChange={(k, v) =>
            setFilters((prev) => ({
              ...prev,
              [k]: v,
            }))
          }
          onReset={resetFilters}
          collapsed={!isSidebarOpen}
          setCollapsed={(collapsed) => setIsSidebarOpen(!collapsed)}
          mobileOpen={false}
          setMobileOpen={setIsSidebarOpen}
        />
      )}

      {isMobile && (
        <DashboardFiltersSidebar
          t={t}
          filters={filters}
          advancedFilters={advancedFilters}
          hasAdvancedFilters={hasAdvancedFilters}
          sortMode={sortMode}
          onSortChange={setSortMode}
          searchOptions={searchOptions}
          onSearchChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              search: v,
            }))
          }
          onQuickFilterChange={(k, v) =>
            setFilters((prev) => ({
              ...prev,
              [k]: v,
            }))
          }
          onAdvancedFilterChange={(k, v) =>
            setFilters((prev) => ({
              ...prev,
              [k]: v,
            }))
          }
          onReset={resetFilters}
          collapsed={false}
          setCollapsed={() => {}}
          mobileOpen={isSidebarOpen}
          setMobileOpen={setIsSidebarOpen}
        />
      )}

      <main
        className={cn(
          "relative flex-1 pt-10 md:pt-14 pb-24 transition-all duration-300"
        )}
      >
        <div
          className="relative w-full space-y-6"
          style={{
            paddingInlineStart: leftPad,
            paddingInlineEnd: navMargin,
          }}
        >
          {isMobile && !isSidebarOpen && (
            <div className="md:hidden sticky top-12 z-30 flex justify-end">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium shadow-sm active:scale-95 transition"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtry
              </button>
            </div>
          )}

          {tripsLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center min-h-[40vh]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Ładuję Twoje podróże...
              </p>
            </div>
          ) : tripsError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center min-h-[40vh]">
              <SearchX className="h-7 w-7 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-lg font-semibold">Nie udało się pobrać podróży</p>
                <p className="text-sm text-muted-foreground">
                  {tripsError}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={reloadTrips}
                className="mt-2"
              >
                Spróbuj ponownie
              </Button>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center min-h-[60vh]">
              <SearchX className="h-7 w-7 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-lg font-semibold">Brak wyników</p>
                <p className="text-sm text-muted-foreground">
                  {filtersActive || searchActive
                    ? "Spróbuj zmienić kryteria wyszukiwania lub filtry."
                    : "Nie znaleźliśmy żadnych podróży do wyświetlenia."}
                </p>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        <AnimatePresence>
          {createOpen && (
            <motion.div
              key="create-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setCreateOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="relative w-[min(960px,calc(100%-32px))] rounded-3xl border border-border/70 bg-background/95 backdrop-blur-xl p-6 md:p-7 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xl font-semibold leading-tight">
                      Nowa podróż
                    </p>
                    <p className="text-sm text-muted-foreground leading-snug">
                      Uzupełnij szczegóły, a podgląd karty wypełni się
                      automatycznie.
                    </p>
                  </div>
                  <button
                    className="text-lg text-muted-foreground hover:text-foreground"
                    onClick={() => setCreateOpen(false)}
                    aria-label="Zamknij"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-5">
                    <div className="space-y-6">
                      <div className="space-y-5">
                        <label className="text-sm font-semibold text-foreground block">
                          Nazwa podróży
                        </label>
                        <Input
                          value={createForm.name}
                          onChange={(e) =>
                            setCreateForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="NP. Wyprawa w Alpy"
                          className="h-11 rounded-xl border border-border/70 bg-card/80 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                        />
                      </div>

                      <div className="space-y-6">
                        <label className="text-sm font-semibold text-foreground block">
                          Destynacja
                        </label>
                        <Input
                          value={createForm.destination}
                          onChange={(e) =>
                            setCreateForm((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          placeholder="NP. Zermatt, Szwajcaria"
                          className="h-11 rounded-xl border border-border/70 bg-card/80 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-5">
                          <label className="text-sm font-semibold text-foreground block">
                            Data startu
                          </label>
                          <Input
                            type="date"
                            value={createForm.startDate}
                            onChange={(e) =>
                              setCreateForm((prev) => ({
                                ...prev,
                                startDate: e.target.value,
                              }))
                            }
                            className="h-11 rounded-xl border border-border/70 bg-card/80 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                          />
                        </div>
                        <div className="space-y-5">
                          <label className="text-sm font-semibold text-foreground block">
                            Data zakończenia
                          </label>
                          <Input
                            type="date"
                            value={createForm.endDate}
                            onChange={(e) =>
                              setCreateForm((prev) => ({
                                ...prev,
                                endDate: e.target.value,
                              }))
                            }
                            className="h-11 rounded-xl border border-border/70 bg-card/80 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <label className="text-sm font-semibold text-foreground block">
                          Opis
                        </label>
                        <Input
                          value={createForm.description}
                          onChange={(e) =>
                            setCreateForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Krótki opis podróży"
                          className="h-11 rounded-xl border border-border/70 bg-card/80 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 rounded-2xl text-base font-semibold bg-primary text-primary-foreground hover:brightness-95 active:scale-[0.99] transition"
                      onClick={() => {
                        console.log("Create trip", createForm, createImage);
                        setCreateOpen(false);
                      }}
                      disabled={
                        !createForm.name.trim() ||
                        !createForm.destination.trim()
                      }
                    >
                      Utwórz podróż
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Podgląd karty
                    </p>
                    <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
                      <div className="rounded-[18px] border border-border/60 overflow-hidden bg-gradient-to-br from-background via-muted/40 to-background shadow-sm">
                        <div
                          className="relative h-40"
                          style={{
                            backgroundImage: createImage
                              ? `url(${createImage})`
                              : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/10 to-background/70" />
                          {createImageLoading && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center text-xs text-muted-foreground">
                              Ładowanie zdjęcia...
                            </div>
                          )}
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-muted-foreground">
                            <span>
                              {createForm.destination || "Destynacja"}
                            </span>
                            <span>
                              {createForm.startDate && createForm.endDate
                                ? `${createForm.startDate} → ${createForm.endDate}`
                                : "Terminy"}
                            </span>
                          </div>
                          <p className="text-lg font-semibold truncate">
                            {createForm.name || "Twoja nowa podróż"}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {createForm.description ||
                              "Dodaj opis, aby ekipa wiedziała, co planujesz."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {joinOpen && (
            <motion.div
              key="join-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 z-40 flex items-center justify-center"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setJoinOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative w-[min(440px,calc(100%-32px))] rounded-3xl border border-border/70 bg-background/95 backdrop-blur-xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xl font-semibold leading-tight">
                      Dołącz do podróży
                    </p>
                    <p className="text-sm text-muted-foreground leading-snug">
                      Wpisz kod zaproszenia, aby dołączyć do istniejącej
                      podróży.
                    </p>
                  </div>
                  <button
                    className="text-lg text-muted-foreground hover:text-foreground"
                    onClick={() => setJoinOpen(false)}
                    aria-label="Zamknij"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 space-y-6">
                  <label className="text-sm font-semibold text-foreground block">
                    Kod zaproszenia
                  </label>
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="NP. TRIP-2025-ABC"
                    className="uppercase tracking-[0.08em] h-12 rounded-xl border border-border/70 bg-card/80 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                    autoFocus
                  />
                </div>

                <Button
                  className="mt-6 w-full h-12 rounded-2xl text-base font-semibold bg-primary text-primary-foreground hover:brightness-95 active:scale-[0.99] transition"
                  onClick={() => {
                    console.log("Join with code", joinCode);
                    setJoinOpen(false);
                  }}
                  disabled={!joinCode.trim()}
                >
                  Dołącz
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
