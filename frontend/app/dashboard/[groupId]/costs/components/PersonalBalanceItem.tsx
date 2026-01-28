"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";
import { cn } from "@/lib/utils";
import type { PersonalBalanceDto } from "../types";

interface Props {
    person: PersonalBalanceDto;
    onSettle: (balance: number, personName: string, personUserId: string) => void;
    tripId: string;
    baseCurrency: string;
}

export default function PersonBalanceItem({ person, onSettle, tripId, baseCurrency }: Props) {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);
    const [expanded, setExpanded] = useState(false);
    const isOwed = person.balance > 0;
    const iOwe = person.balance < 0;

    return (
        <div className={cn(
            "border rounded-lg overflow-hidden",
            isOwed && "border-green-200 dark:border-green-800",
            iOwe && "border-destructive/20"
        )}>
            {/* Header with Settle Button */}
            <div className={cn(
                "p-3 space-y-3",
                isOwed && "bg-green-50 dark:bg-green-950/20",
                iOwe && "bg-destructive/5"
            )}>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                            isOwed && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                            iOwe && "bg-destructive/10 text-destructive"
                        )}>
                            {person.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-sm">{person.userName}</p>
                            <p className="text-xs text-muted-foreground">
                                {person.expenses.length} {person.expenses.length === 1 ? t.expense : t.expenses}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "font-bold text-sm",
                            isOwed && "text-green-600 dark:text-green-400",
                            iOwe && "text-destructive"
                        )}>
                            {isOwed ? '+' : ''}{person.balance.toFixed(2)} {baseCurrency}
                        </span>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </button>

                {/* Settle Button - Always visible */}
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSettle(person.balance, person.userName, person.userId);
                    }}
                    variant={iOwe ? "destructive" : "default"}
                    size="sm"
                    className="w-full"
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {iOwe ? t.markAsPaid : t.markAsReceived}
                </Button>
            </div>

            {/* Expanded - expense breakdown (read-only, no buttons) */}
            {expanded && (
                <div className="border-t p-3 bg-muted/20 space-y-2">
                    {person.expenses.map((exp) => {
                        const expenseIsOwed = exp.balance > 0;
                        const expenseIOwe = exp.balance < 0;

                        return (
                            <div key={exp.expenseId} className={cn(
                                "p-3 bg-background rounded-lg border space-y-2",
                                expenseIsOwed && "border-green-200 dark:border-green-800",
                                expenseIOwe && "border-destructive/20"
                            )}>
                                {/* Expense Header */}
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-sm">{exp.expenseTitle}</span>
                                    <span className={cn(
                                        "font-bold text-sm",
                                        expenseIsOwed && "text-green-600 dark:text-green-400",
                                        expenseIOwe && "text-destructive"
                                    )}>
                                        {expenseIsOwed ? '+' : ''}{exp.balance.toFixed(2)} {baseCurrency}
                                    </span>
                                </div>

                                {/* Expense Details */}
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                    <div className="flex justify-between">
                                        <span>{t.myShare}</span>
                                        <span>{exp.myShare.toFixed(2)} {baseCurrency}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t.iPaid}</span>
                                        <span className="font-medium">{exp.iPaid.toFixed(2)} {baseCurrency}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}