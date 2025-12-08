import { MapPin } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

export default function LocationSection({
  t,
  advancedFilters,
  onAdvancedFilterChange,
}: any) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        {t.dashboard.filters.location}
      </Label>

      <Input
        placeholder={t.dashboard.filters.locationPlaceholder ?? "np. Chorwacja"}
        value={advancedFilters.location}
        onChange={(e) => onAdvancedFilterChange("location", e.target.value)}
        className={cn(
          "bg-card/50 border-border/60 rounded-xl",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
        )}
      />
    </div>
  );
}
