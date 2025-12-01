"use client";

export function ServerErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
}
