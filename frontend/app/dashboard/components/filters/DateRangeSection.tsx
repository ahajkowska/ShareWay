import { Calendar } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

export default function DateRangeSection({
  t,
  advancedFilters,
  onAdvancedFilterChange,
}: any) {
  return (
    <div className="space-y-3">
      <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {t.dashboard.filters.dateRange}
      </Label>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <span className="text-[11px] text-muted-foreground">
            {t.dashboard.filters.from}
          </span>
          <Input
            type="date"
            value={advancedFilters.dateFrom}
            onChange={(e) => onAdvancedFilterChange("dateFrom", e.target.value)}
            className={cn(
              "bg-card/50 border-border/60 rounded-xl",
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
            )}
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] text-muted-foreground">
            {t.dashboard.filters.to}
          </span>
          <Input
            type="date"
            value={advancedFilters.dateTo}
            onChange={(e) => onAdvancedFilterChange("dateTo", e.target.value)}
            className={cn(
              "bg-card/50 border-border/60 rounded-xl",
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
            )}
          />
        </div>
      </div>
    </div>
  );
}
