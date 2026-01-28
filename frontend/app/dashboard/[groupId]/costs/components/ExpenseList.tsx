"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Trash2, RefreshCw, Pencil, Filter } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";
import type { ExpenseDto } from "../types";
import { useSession } from "@/app/context/SessionContext";

interface Props {
    expenses: ExpenseDto[];
    loading: boolean;
    onDelete: (expenseId: string) => Promise<void>;
    onEdit: (expense: ExpenseDto) => void;
    onRefresh: () => Promise<void>;
    baseCurrency: string;
}

export default function ExpenseList({ expenses, loading, onDelete, onEdit, onRefresh, baseCurrency }: Props) {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);
    const { user } = useSession();
    const [showSettlements, setShowSettlements] = useState(false);
    
    // Filter out settlement expenses unless showSettlements is true
    const filteredExpenses = showSettlements 
        ? expenses 
        : expenses.filter(e => e.status !== 'SETTLED' && !e.title.startsWith('Rozliczenie z'));

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
                <CardTitle>{t.expenses} ({filteredExpenses.length})</CardTitle>
                <div className="flex items-center gap-2">
                    <Button 
                        variant={showSettlements ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setShowSettlements(!showSettlements)}
                        className="gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        {showSettlements ? t.hideSettlements : t.showSettlements}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onRefresh}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {filteredExpenses.map((expense) => {
                        const isSettlement = expense.status === 'SETTLED' || expense.title.startsWith('Rozliczenie z');
                        return (
                        <div
                            key={expense.id}
                            className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors ${isSettlement ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''}`}
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
                            <div className="flex gap-1">
                                {user?.id === expense.paidBy && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(expense)}
                                        className="text-primary hover:text-primary"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(expense.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
