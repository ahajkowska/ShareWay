import { Search } from "lucide-react";
import type { RefObject } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

export default function FilterSearchSection({
  t,
  filters,
  onSearchChange,
  searchInputRef,
}: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {t.dashboard.filters.searchLabel ?? "Wyszukiwanie"}
      </Label>

      <div className="relative flex items-center rounded-xl bg-muted/15 border border-border/40 px-2 py-1 transition-colors">
        <Search className="h-4 w-4 text-muted-foreground ml-1" />

        <Input
          placeholder={t.dashboard.filters.searchPlaceholder ?? "Szukaj..."}
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          ref={searchInputRef as RefObject<HTMLInputElement>}
          className={cn(
            "border-none bg-transparent shadow-none outline-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "h-10 pl-2 pr-3"
          )}
        />
      </div>
    </div>
  );
}
