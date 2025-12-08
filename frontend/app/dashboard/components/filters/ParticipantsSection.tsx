import { Users } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

export default function ParticipantsSection({
  t,
  advancedFilters,
  onAdvancedFilterChange,
}: any) {
  return (
    <div className="space-y-3">
      <Label className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1">
        <Users className="h-3 w-3" />
        {t.dashboard.filters.participantsCount}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <span className="text-[11px] text-muted-foreground">
            {t.dashboard.filters.min}
          </span>
          <Input
            type="number"
            min={0}
            value={advancedFilters.minParticipants}
            onChange={(e) =>
              onAdvancedFilterChange("minParticipants", e.target.value)
            }
            className={cn(
              "bg-card/50 border-border/60 rounded-xl text-sm",
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
            )}
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-[11px] text-muted-foreground">
            {t.dashboard.filters.max}
          </span>
          <Input
            type="number"
            min={0}
            value={advancedFilters.maxParticipants}
            onChange={(e) =>
              onAdvancedFilterChange("maxParticipants", e.target.value)
            }
            className={cn(
              "bg-card/50 border-border/60 rounded-xl text-sm",
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
            )}
          />
        </div>
      </div>
    </div>
  );
}
