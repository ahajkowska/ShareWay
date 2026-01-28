"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";
import type { ExpenseDto } from "../types";

interface Props {
    expenses: ExpenseDto[];
    loading: boolean;
    onDelete: (expenseId: string) => Promise<void>;
    onRefresh: () => Promise<void>;
    baseCurrency: string;
}

export default function ExpenseList({ expenses, loading, onDelete, onRefresh, baseCurrency }: Props) {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t.expenses}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-20 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!expenses || expenses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t.expenses}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg mb-2">{t.noExpenses}</p>
                        <p className="text-sm">{t.addFirstExpense}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.expenses} ({expenses.length})</CardTitle>
                <Button variant="ghost" size="sm" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {expenses.map((expense) => (
                        <div
                            key={expense.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1">
                                <h4 className="font-medium">{expense.title}</h4>
                                {expense.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {expense.description}
                                    </p>
                                )}
                                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>{t.paidBy}: {expense.paidByName}</span>
                                    <span>{t.date}: {new Date(expense.date).toLocaleDateString(t.locale)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold">{expense.amount.toFixed(2)} {baseCurrency}</p>
                                <p className="text-xs text-muted-foreground">
                                    {expense.splitBetween.length} {expense.splitBetween.length === 1 ? t.person : t.people}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(expense.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
