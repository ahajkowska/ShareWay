"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Banknote } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";
import { cn } from "@/lib/utils";
import type { ExpenseBreakdown } from "../types";
import * as api from "@/lib/api";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense: ExpenseBreakdown & { personName: string; personUserId: string; tripId: string };
    myUserId: string;
    baseCurrency: string;
    onSettled?: () => void;
}

export default function SettleBalanceDialog({ open, onOpenChange, expense, myUserId, baseCurrency, onSettled }: Props) {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);
    const [amount, setAmount] = useState(Math.abs(expense.balance).toFixed(2));
    const [submitting, setSubmitting] = useState(false);

    const iOwe = expense.balance < 0;
    const theyOweMe = expense.balance > 0;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert(t.enterValidAmount);
            return;
        }

        if (amountNum > Math.abs(expense.balance)) {
            alert(t.amountCannotExceed(Math.abs(expense.balance).toFixed(2), baseCurrency));
            return;
        }

        try {
            setSubmitting(true);

            const settlementPayload = {
                amount: Math.round(amountNum * 100),
                description: iOwe 
                    ? `${t.settlement}: ${expense.expenseTitle}` 
                    : `${t.received}: ${expense.expenseTitle}`,
                date: new Date().toISOString(),
                debtorIds: iOwe ? [expense.personUserId] : [myUserId],
            };

            await api.createExpense(expense.tripId, settlementPayload);
            
            onSettled?.();
            onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            alert(err.message || t.settlementError);
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
                        <h3 className="text-lg font-bold">{t.markAsSettled}</h3>
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
                                    <span>{t.totalAmount}</span>
                                    <span className="font-medium">{expense.totalAmount.toFixed(2)} {baseCurrency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t.myShare}</span>
                                    <span className="font-medium">{expense.myShare.toFixed(2)} {baseCurrency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t.iPaid}</span>
                                    <span className="font-medium">{expense.iPaid.toFixed(2)} {baseCurrency}</span>
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
                                    {iOwe && `${t.youAreGivingMoneyTo} ${expense.personName}`}
                                    {theyOweMe && `${t.youAreReceivingMoneyFrom} ${expense.personName}`}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {iOwe && `${t.youOweForThisExpense} `}
                                {theyOweMe && `${t.theyOweForThisExpense} `}
                                <span className={cn(
                                    "font-bold",
                                    iOwe && "text-destructive",
                                    theyOweMe && "text-green-600 dark:text-green-400"
                                )}>
                                    {Math.abs(expense.balance).toFixed(2)} {baseCurrency}
                                </span>
                            </p>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t.amountToSettle} <span className="text-destructive">*</span>
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
                                {t.canSettlePartial}
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
                                {t.half}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setAmount(Math.abs(expense.balance).toFixed(2))}
                                className="flex-1"
                            >
                                {t.full}
                            </Button>
                        </div>

                        {/* Info */}
                        <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                            <p className="font-medium mb-1">{t.information}</p>
                            <p>
                                {t.settleInfo}
                                {iOwe && ` ${t.makeSureYouPaid}`}
                                {theyOweMe && ` ${t.makeSureYouReceived}`}
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
                                {t.cancel}
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
                                {submitting ? t.saving : t.markAsSettled}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}