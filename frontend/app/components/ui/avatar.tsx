import { cn } from "@/lib/utils";
export function Avatar({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted",
        className
      )}
    >
      {children}
    </div>
  );
}
export function AvatarFallback({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-full w-full items-center justify-center rounded-full select-none",
        className
      )}
    >
      {children}
    </span>
  );
}
