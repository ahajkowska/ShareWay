"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import * as api from "@/lib/api";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "../translations";
import type { CreateExpenseDto } from "../types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
    onCreated?: () => void;
}

export default function CreateExpenseDialog({ open, onOpenChange, tripId, onCreated }: Props) {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [splitBetween, setSplitBetween] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Mock users - zamień na prawdziwe dane z API
    const mockUsers = [
        { id: "user-1", name: "Jan Kowalski" },
        { id: "user-2", name: "Anna Nowak" },
        { id: "user-3", name: "Piotr Wiśniewski" },
        { id: "user-4", name: "Maria Zielińska" },
    ];

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        if (!title.trim()) {
            alert(t.titleRequired);
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            alert(t.invalidAmount);
            return;
        }
        if (!paidBy) {
            alert(t.choosePayer);
            return;
        }
        if (splitBetween.length === 0) {
            alert(t.chooseSplit);
            return;
        }

        try {
            setSubmitting(true);
            
            const payload: CreateExpenseDto = {
                title: title.trim(),
                description: description.trim() || undefined,
                amount: parseFloat(amount),
                paidBy: paidBy,
                splitBetween: splitBetween,
                date: new Date().toISOString(),
            };

            // MOCK - tylko zamknij dialog
            console.log("Creating expense:", payload);
            
            // Reset form
            setTitle("");
            setDescription("");
            setAmount("");
            setPaidBy("");
            setSplitBetween([]);
            
            onCreated?.();
            onOpenChange(false);
            
            // PRAWDZIWE API - odkomentuj gdy backend działa
            // await api.createExpense(tripId, payload);
            // setTitle("");
            // setDescription("");
            // setAmount("");
            // setPaidBy("");
            // setSplitBetween([]);
            // onCreated?.();
            // onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            alert(err.message || t.createExpenseError);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleUserInSplit = (userId: string) => {
        setSplitBetween(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAllUsers = () => {
        setSplitBetween(mockUsers.map(u => u.id));
    };

    const deselectAllUsers = () => {
        setSplitBetween([]);
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
                    className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background z-10">
                        <h3 className="text-lg font-bold">{t.newExpense}</h3>
                        <button 
                            onClick={() => onOpenChange(false)} 
                            className="p-2 hover:bg-muted rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t.expenseTitle} <span className="text-destructive">*</span>
                            </label>
                            <input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder={t.expenseTitlePlaceholder}
                                className="w-full px-4 py-3 rounded-xl border border-input" 
                                autoFocus 
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">{t.description} ({t.optional})</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                placeholder={t.descriptionPlaceholder}
                                rows={2} 
                                className="w-full px-4 py-3 rounded-xl border border-input resize-none" 
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t.amountLabel} ({t.pln}) <span className="text-destructive">*</span>
                            </label>
                            <input 
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-input" 
                            />
                        </div>

                        {/* Paid By */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t.paidBy} <span className="text-destructive">*</span>
                            </label>
                            <select
                                value={paidBy}
                                onChange={(e) => setPaidBy(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground"
                            >
                                <option value="">{t.choosePersonPlaceholder}</option>
                                {mockUsers.map(user => (
                                    <option 
                                        key={user.id} 
                                        value={user.id}
                                    >
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Split Between */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">
                                    {t.splitBetween} <span className="text-destructive">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={selectAllUsers}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        {t.selectAll}
                                    </button>
                                    <span className="text-xs text-muted-foreground">|</span>
                                    <button
                                        type="button"
                                        onClick={deselectAllUsers}
                                        className="text-xs text-muted-foreground hover:underline"
                                    >
                                        {t.deselect}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 border rounded-xl p-3">
                                {mockUsers.map(user => (
                                    <label 
                                        key={user.id}
                                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={splitBetween.includes(user.id)}
                                            onChange={() => toggleUserInSplit(user.id)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">{user.name}</span>
                                    </label>
                                ))}
                            </div>
                            {splitBetween.length > 0 && amount && parseFloat(amount) > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    {t.splitPerPerson(((parseFloat(amount) / splitBetween.length)).toFixed(2))}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => onOpenChange(false)} 
                                disabled={submitting}
                            >
                                {t.cancel}
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? t.adding : t.addExpense}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}