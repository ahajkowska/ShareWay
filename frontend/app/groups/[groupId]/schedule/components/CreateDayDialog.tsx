"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (date: string) => Promise<void>;
}

export default function CreateDayDialog({ open, onOpenChange, onSubmit }: Props) {
    const [date, setDate] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!date) {
        alert("Wybierz datę");
        return;
        }
        try {
        setSubmitting(true);
        await onSubmit(date);
        setDate("");
        } catch (err: any) {
        console.error(err);
        alert(err.message || "Błąd tworzenia dnia");
        } finally {
        setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/50" />

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-bold">Dodaj dzień</h3>
                <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-muted rounded">
                <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input" />
                </div>

                <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Anuluj</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Dodawanie..." : "Dodaj dzień"}</Button>
                </div>
            </form>
            </motion.div>
        </div>
        </AnimatePresence>
    );
}