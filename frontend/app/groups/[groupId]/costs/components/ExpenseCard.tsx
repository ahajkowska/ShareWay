"use client";

import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Trash2, Users, Calendar, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import type { ExpenseDto } from "../types";

interface Props {
    expense: ExpenseDto;
    onDelete: (id: string) => Promise<void>;
}

export default function ExpenseCard({ expense, onDelete }: Props) {
    const perPersonAmount = expense.splitBetween.length > 0 
        ? expense.amount / expense.splitBetween.length 
        : expense.amount;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                            {expense.title || "Wydatek"}
                        </CardTitle>
                        {expense.description && (
                            <p className="text-sm text-muted-foreground">
                                {expense.description}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                            {expense.amount.toFixed(2)} PLN
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {perPersonAmount.toFixed(2)} PLN / os.
                        </div>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
                {/* Informacje o płatniku */}
                <div className="flex items-center gap-2 text-sm">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Zapłacił:</span>
                    <span className="font-medium">{expense.paidByName || "Nieznany"}</span>
                </div>

                {/* Data */}
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                        {format(new Date(expense.date || expense.createdAt), "d MMMM yyyy, HH:mm", { locale: pl })}
                    </span>
                </div>

                {/* Uczestnicy */}
                <div className="flex items-start gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <span className="text-muted-foreground">
                            Podział między ({expense.splitBetween.length} {expense.splitBetween.length === 1 ? "osoba" : "osób"}):
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {expense.splitBetween.map((personName, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-muted rounded-full text-xs font-medium"
                                >
                                    {personName}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Przycisk usuwania */}
                <div className="pt-2 border-t flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(expense.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Usuń wydatek
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}