"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ArrowUpAZ,
  ArrowDownAZ,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SortMode = "newest" | "oldest" | "a-z" | "z-a" | "participants";

export default function SortControl({
  value,
  onChange,
  inline = false,
}: {
  value: SortMode;
  onChange: (v: SortMode) => void;
  inline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isOpen = inline ? true : open;

  const handleSelect = (mode: SortMode) => {
    const next = value === mode ? "newest" : mode;
    onChange(next);
    if (!inline) setOpen(false);
  };

  const options = [
    {
      value: "newest",
      label: "Najbliższe wyjazdy",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "oldest",
      label: "Najpóźniejsze wyjazdy",
      icon: <Clock className="w-4 h-4 rotate-180" />,
    },
    {
      value: "a-z",
      label: "Nazwa A–Z",
      icon: <ArrowUpAZ className="w-4 h-4" />,
    },
    {
      value: "z-a",
      label: "Nazwa Z–A",
      icon: <ArrowDownAZ className="w-4 h-4" />,
    },
    {
      value: "participants",
      label: "Najwięcej uczestników",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  if (inline) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-background/80 dark:bg-slate-900/70 p-3 shadow-sm">
        <div className="flex flex-col divide-y divide-border/70">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value as SortMode)}
              className={cn(
                "flex items-center gap-2 px-2 py-2 text-sm text-left transition hover:bg-muted/70 rounded-lg",
                value === opt.value &&
                  "bg-primary/10 text-primary font-semibold"
              )}
            >
              {opt.icon}
              <span className="flex-1 text-left">{opt.label}</span>
              {opt.value === "newest" && (
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Domyślnie
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-end">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted",
          "dark:hover:bg-muted/30"
        )}
      >
        <span>Sortuj</span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-52 rounded-md border border-border bg-background shadow-lg z-20"
          )}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value as SortMode)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted",
                value === opt.value && "bg-muted font-semibold"
              )}
            >
              {opt.icon}
              <span className="flex-1 text-left">{opt.label}</span>
              {opt.value === "newest" && (
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Domyślnie
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
