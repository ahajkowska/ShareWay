import { cn } from "@/lib/utils";
export function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
