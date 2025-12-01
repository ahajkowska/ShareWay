"use client";

import React, { useMemo } from "react";
import { CheckCircle2, Circle } from "lucide-react";

type Labels = {
  min: string;
  lower: string;
  upper: string;
  number: string;
  special: string;
};

type StrengthLabels = {
  weak: string;
  medium: string;
  strong: string;
  veryStrong: string;
};

export function PasswordChecklist({
  password,
  labels,
  strengthLabels,
}: {
  password: string;
  labels: Labels;
  strengthLabels: StrengthLabels;
}) {
  const rules = useMemo(() => {
    const len = password.length >= 8;
    const low = /[a-z]/.test(password);
    const up = /[A-Z]/.test(password);
    const num = /\d/.test(password);
    const spec = /[^A-Za-z0-9]/.test(password);
    const score = [len, low, up, num, spec].filter(Boolean).length;
    return { len, low, up, num, spec, score };
  }, [password]);

  const { score } = rules;
  const width = (score / 5) * 100;

  let barColor = "bg-red-500";
  let strengthText = strengthLabels.weak;
  if (score === 2) {
    barColor = "bg-yellow-500";
    strengthText = strengthLabels.medium;
  } else if (score === 3 || score === 4) {
    barColor = "bg-amber-500";
    strengthText = strengthLabels.strong;
  } else if (score === 5) {
    barColor = "bg-emerald-500";
    strengthText = strengthLabels.veryStrong;
  }

  const Item = ({ ok, text }: { ok: boolean; text: string }) => (
    <li className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={ok ? "text-emerald-700" : "text-muted-foreground"}>
        {text}
      </span>
    </li>
  );

  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${barColor}`}
            style={{ width: `${width}%` }}
          />
        </div>
        <span className="text-xs font-medium min-w-[90px] text-right">
          {strengthText}
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
        <Item ok={rules.len} text={labels.min} />
        <Item ok={rules.low} text={labels.lower} />
        <Item ok={rules.up} text={labels.upper} />
        <Item ok={rules.num} text={labels.number} />
        <Item ok={rules.spec} text={labels.special} />
      </ul>
    </div>
  );
}
