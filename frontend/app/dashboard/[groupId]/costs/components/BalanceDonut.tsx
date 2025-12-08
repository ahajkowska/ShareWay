"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";

interface Props {
    netBalance: number;
    totalIOweThem: number;
    totalTheyOweMe: number;
}

export default function BalanceDonut({ netBalance, totalIOweThem, totalTheyOweMe }: Props) {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);
    
    const total = totalIOweThem + totalTheyOweMe;
    const iOwePercentage = total > 0 ? (totalIOweThem / total) * 100 : 0;
    const theyOwePercentage = total > 0 ? (totalTheyOweMe / total) * 100 : 0;

    const size = 180;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const iOweStrokeDash = (iOwePercentage / 100) * circumference;
    const theyOweStrokeDash = (theyOwePercentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-muted/20"
                    />

                    {theyOwePercentage > 0 && (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${theyOweStrokeDash} ${circumference}`}
                            strokeLinecap="round"
                            className="text-green-500 transition-all duration-500"
                        />
                    )}

                    {iOwePercentage > 0 && (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${iOweStrokeDash} ${circumference}`}
                            strokeDashoffset={-theyOweStrokeDash}
                            strokeLinecap="round"
                            className="text-destructive transition-all duration-500"
                        />
                    )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.balance}</p>
                    <p className={cn(
                        "text-2xl font-bold",
                        netBalance > 0 && "text-green-600 dark:text-green-400",
                        netBalance < 0 && "text-destructive",
                        netBalance === 0 && "text-foreground"
                    )}>
                        {netBalance > 0 ? '+' : ''}{netBalance.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.pln}</p>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div>
                        <p className="text-muted-foreground">{t.theyOweMe}</p>
                        <p className="font-bold text-green-600 dark:text-green-400">
                            {totalTheyOweMe.toFixed(2)} {t.pln}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div>
                        <p className="text-muted-foreground">{t.iOweLabel}</p>
                        <p className="font-bold text-destructive">
                            {totalIOweThem.toFixed(2)} {t.pln}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}