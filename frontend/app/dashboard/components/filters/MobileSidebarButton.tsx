import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileSidebarButton({
  t,
  hasAdvancedFilters,
  onClick,
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "md:hidden fixed right-4 top-20 z-30 inline-flex items-center gap-2 rounded-full",
        "border border-border bg-background/95 px-3 py-1.5 text-xs font-medium",
        "shadow-sm active:scale-95 transition"
      )}
      aria-label={t.dashboard.filters.openSidebar ?? "Otwórz filtry"}
    >
      <Filter className="h-3.5 w-3.5" />
      {t.dashboard.filters.buttonLabel ?? "Filtry"}
      {hasAdvancedFilters && (
        <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
          ●
        </span>
      )}
    </button>
  );
}
