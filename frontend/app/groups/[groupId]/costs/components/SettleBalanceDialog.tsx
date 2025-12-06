"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Banknote } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExpenseBreakdown } from "../types";
import * as api from "@/lib/api";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense: ExpenseBreakdown & { personName: string; personUserId: string; tripId: string };
    myUserId: string;
    onSettled?: () => void;
}

export default function SettleBalanceDialog({ open, onOpenChange, expense, myUserId, onSettled }: Props) {
    const [amount, setAmount] = useState(Math.abs(expense.balance).toFixed(2));
    const [submitting, setSubmitting] = useState(false);

    const iOwe = expense.balance < 0;
    const theyOweMe = expense.balance > 0;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert("Wpisz poprawną kwotę");
            return;
        }

        if (amountNum > Math.abs(expense.balance)) {
            alert(`Kwota nie może być większa niż ${Math.abs(expense.balance).toFixed(2)} PLN`);
            return;
        }

        try {
            setSubmitting(true);

            // Odwrotny wydatek
            const settlementPayload = {
                amount: Math.round(amountNum * 100), // PLN → centy
                description: iOwe 
                    ? `Rozliczenie: ${expense.expenseTitle}` 
                    : `Otrzymano: ${expense.expenseTitle}`,
                date: new Date().toISOString(),
                debtorIds: iOwe ? [expense.personUserId] : [myUserId],
                // Jeśli JA jestem winien:
                //   - Payer = JA (current user)
                //   - Debtor = druga osoba
                // Jeśli DRUGA osoba jest winna:
                //   - Payer = JA (current user) - ale to będzie "odwrotny" expense
                //   - Debtor = JA - żeby anulować dług
            };

            await api.createExpense(expense.tripId, settlementPayload);
            
            onSettled?.();
            onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Błąd podczas zapisywania rozliczenia");
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    onClick={() => onOpenChange(false)} 
                    className="absolute inset-0 bg-black/50" 
                />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }} 
                    className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md"
                >
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-lg font-bold">Oznacz jako rozliczone</h3>
                        <button 
                            onClick={() => onOpenChange(false)} 
                            className="p-2 hover:bg-muted rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Expense Info */}
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <p className="font-semibold mb-2">{expense.expenseTitle}</p>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex justify-between">
                                    <span>Łączna kwota:</span>
                                    <span className="font-medium">{expense.totalAmount.toFixed(2)} PLN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Mój udział:</span>
                                    <span className="font-medium">{expense.myShare.toFixed(2)} PLN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ja zapłaciłem:</span>
                                    <span className="font-medium">{expense.iPaid.toFixed(2)} PLN</span>
                                </div>
                            </div>
                        </div>

                        {/* Settlement Info */}
                        <div className={cn(
                            "p-4 rounded-lg border-2",
                            iOwe && "bg-destructive/5 border-destructive/20",
                            theyOweMe && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                        )}>
                            <div className="flex items-center gap-3 mb-2">
                                <Banknote className={cn(
                                    "w-5 h-5",
                                    iOwe && "text-destructive",
                                    theyOweMe && "text-green-600 dark:text-green-400"
                                )} />
                                <p className="font-medium text-sm">
                                    {iOwe && `Oddajesz pieniądze dla: ${expense.personName}`}
                                    {theyOweMe && `Otrzymujesz pieniądze od: ${expense.personName}`}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {iOwe && `Jesteś winien/winna za ten wydatek: `}
                                {theyOweMe && `Jest Ci winien/winna za ten wydatek: `}
                                <span className={cn(
                                    "font-bold",
                                    iOwe && "text-destructive",
                                    theyOweMe && "text-green-600 dark:text-green-400"
                                )}>
                                    {Math.abs(expense.balance).toFixed(2)} PLN
                                </span>
                            </p>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Kwota do rozliczenia (PLN) <span className="text-destructive">*</span>
                            </label>
                            <input 
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={Math.abs(expense.balance)}
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-input text-lg font-medium" 
                                autoFocus
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Możesz rozliczyć całość lub część kwoty za ten wydatek
                            </p>
                        </div>

                        {/* Quick Buttons */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setAmount((Math.abs(expense.balance) / 2).toFixed(2))}
                                className="flex-1"
                            >
                                Połowa
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setAmount(Math.abs(expense.balance).toFixed(2))}
                                className="flex-1"
                            >
                                Całość
                            </Button>
                        </div>

                        {/* Info */}
                        <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                            <p className="font-medium mb-1">Informacja</p>
                            <p>
                                Zostanie utworzony wydatek rozliczeniowy, który automatycznie wyrówna saldo.
                                {iOwe && " Upewnij się, że faktycznie przekazałeś pieniądze."}
                                {theyOweMe && " Upewnij się, że faktycznie otrzymałeś pieniądze."}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => onOpenChange(false)} 
                                disabled={submitting}
                                className="flex-1"
                            >
                                Anuluj
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className={cn(
                                    "flex-1",
                                    iOwe && "bg-destructive hover:bg-destructive/90"
                                )}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {submitting ? "Zapisywanie..." : "Oznacz jako rozliczone"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}