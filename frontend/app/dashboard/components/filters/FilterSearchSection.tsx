import { Search } from "lucide-react";
import type { KeyboardEvent, RefObject } from "react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { FilterState } from "@/lib/types/trip";
import { cn, normalizeSearchText } from "@/lib/utils";

type FilterSearchSectionProps = {
  t: any;
  filters: Pick<FilterState, "search">;
  onSearchChange: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  suggestionOptions?: string[];
};

const SUGGESTION_LIMIT = 6;

export default function FilterSearchSection({
  t,
  filters,
  onSearchChange,
  searchInputRef,
  suggestionOptions = [],
}: FilterSearchSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedOptions = useMemo(() => {
    const unique = new Map<string, string>();

    suggestionOptions.forEach((option) => {
      const normalized = normalizeSearchText(option);
      if (!normalized || unique.has(normalized)) return;
      unique.set(normalized, option);

      option
        .split(",")
        .map((part) => part.trim())
        .forEach((part) => {
          const normalizedPart = normalizeSearchText(part);
          if (normalizedPart && !unique.has(normalizedPart)) {
            unique.set(normalizedPart, part);
          }
        });
    });

    return Array.from(unique.entries()).map(([normalized, label]) => ({
      normalized,
      label,
    }));
  }, [suggestionOptions]);

  const searchTerm = normalizeSearchText(filters.search);

  const suggestions = useMemo(() => {
    if (!normalizedOptions.length) return [];
    if (!searchTerm) return [];

    return normalizedOptions
      .map(({ normalized, label }) => {
        const index = normalized.indexOf(searchTerm);
        if (index === -1) return null;

        const score =
          (index === 0 ? 3 : 0) +
          Math.max(0, 2 - index * 0.1) +
          Math.min(searchTerm.length, 8) * 0.05;

        return { label, score };
      })
      .filter((v): v is { label: string; score: number } => !!v)
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, SUGGESTION_LIMIT)
      .map((item) => item.label);
  }, [normalizedOptions, searchTerm]);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions.length]);

  const showSuggestions =
    isFocused && searchTerm.length > 0 && suggestions.length > 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev - 1 < 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (event.key === "Enter") {
      if (suggestions[activeIndex]) {
        event.preventDefault();
        onSearchChange(suggestions[activeIndex]);
        requestAnimationFrame(() => {
          searchInputRef.current?.blur();
          setIsFocused(false);
        });
      }
    } else if (event.key === "Escape") {
      searchInputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleSuggestionPick = (value: string) => {
    onSearchChange(value);
    requestAnimationFrame(() => searchInputRef.current?.blur());
  };

  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {t.dashboard.filters.searchLabel ?? "Wyszukiwanie"}
      </Label>

      <div className="group relative flex h-11 items-center rounded-xl bg-muted/15 border border-border/40 px-3 transition-colors focus-within:border-primary/60 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/12 focus-within:shadow-[0_8px_28px_-18px_rgba(0,0,0,0.45)]">
        <Search className="h-4 w-4 text-muted-foreground ml-1 transition-colors group-focus-within:text-primary" />

        <Input
          placeholder={t.dashboard.filters.searchPlaceholder ?? "Szukaj..."}
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
          className={cn(
            "h-full w-full pl-2 pr-3",
            "border-none bg-transparent shadow-none outline-none",
            "ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0",
            "focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none focus-visible:shadow-none",
            "focus:outline-none"
          )}
        />

        {showSuggestions && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-border/60 bg-background/95 shadow-xl ring-1 ring-primary/8 backdrop-blur">
            <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Podpowiedzi
            </p>
            <div className="py-1">
              {suggestions.map((option, idx) => (
                <button
                  key={`${option}-${idx}`}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                    idx === activeIndex
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/60"
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionPick(option);
                  }}
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
