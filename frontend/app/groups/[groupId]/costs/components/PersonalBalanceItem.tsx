"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";
import { cn } from "@/lib/utils";
import type { PersonalBalanceDto, ExpenseBreakdown } from "../types";

interface Props {
    person: PersonalBalanceDto;
    onSettleExpense: (expense: ExpenseBreakdown, personName: string) => void;
    tripId: string;
}

export default function PersonBalanceItem({ person, onSettleExpense, tripId }: Props) {
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
            {/* Header - clickable */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors",
                    isOwed && "bg-green-50 dark:bg-green-950/20",
                    iOwe && "bg-destructive/5"
                )}
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
                        {isOwed ? '+' : ''}{person.balance.toFixed(2)} {t.pln}
                    </span>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* Expanded - expense breakdown */}
            {expanded && (
                <div className="border-t p-3 bg-muted/20 space-y-2">
                    {person.expenses.map((exp) => {
                        const expenseIsOwed = exp.balance > 0;
                        const expenseIOwe = exp.balance < 0;

                        return (
                            <div key={exp.expenseId} className={cn(
                                "p-3 bg-background rounded-lg border-2 space-y-2",
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
                                        {expenseIsOwed ? '+' : ''}{exp.balance.toFixed(2)} {t.pln}
                                    </span>
                                </div>

                                {/* Expense Details */}
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                    <div className="flex justify-between">
                                        <span>{t.myShare}</span>
                                        <span>{exp.myShare.toFixed(2)} {t.pln}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t.iPaid}</span>
                                        <span className="font-medium">{exp.iPaid.toFixed(2)} {t.pln}</span>
                                    </div>
                                </div>

                                {/* Status Info */}
                                {expenseIsOwed && (
                                    <div className="text-xs text-green-600 dark:text-green-400 pt-2 border-t">
                                        → {person.userName} {t.owesMe} {exp.balance.toFixed(2)} {t.pln}
                                    </div>
                                )}
                                {expenseIOwe && (
                                    <div className="text-xs text-destructive pt-2 border-t">
                                        → {t.iOwe} {person.userName} {Math.abs(exp.balance).toFixed(2)} {t.pln}
                                    </div>
                                )}

                                {/* Settle Button per Expense */}
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSettleExpense(exp, person.userName);
                                    }}
                                    variant={expenseIOwe ? "destructive" : "default"}
                                    size="sm"
                                    className="w-full"
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-2" />
                                    {expenseIOwe ? t.markAsPaid : t.markAsReceived}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}