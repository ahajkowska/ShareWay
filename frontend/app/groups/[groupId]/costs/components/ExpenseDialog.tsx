"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import * as api from "../lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => Promise<void>;
}

export default function CreateExpenseDialog({ open, onOpenChange, onSubmit }: Props) {
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState("");
    const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [participants, setParticipants] = useState<Array<{id:string,name:string}>>([]);

    useEffect(() => {
        // TODO: fetch real participants for trip (replace with proper endpoint)
        setParticipants([
        { id: "1", name: "Anna" },
        { id: "2", name: "Jan" },
        { id: "3", name: "Piotr" },
        ]);
        // select all by default
        setSelectedDebtors(["1","2","3"]);
    }, []);

    const toggleDebtor = (id: string) => {
        setSelectedDebtors(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const val = parseFloat(amount.replace(",", "."));
        if (isNaN(val) || val <= 0) {
        alert("Podaj poprawną kwotę");
        return;
        }
        if (selectedDebtors.length === 0) {
        alert("Wybierz przynajmniej jednego dłużnika");
        return;
        }

        try {
        setSubmitting(true);
        // Payer = current user
        const payload = {
            amount: val,
            description: description.trim(),
            debtorIds: selectedDebtors,
            splitMethod: "equal",
        };
        await onSubmit(payload);
        } finally {
        setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/50" />

            <motion.div initial={{ opacity: 0, scale: 0.98, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 12 }} className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-bold">Nowy wydatek</h3>
                <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-muted rounded">
                <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                <label className="block text-sm font-medium mb-2">Kwota ({/* TODO: show trip currency */}PLN)</label>
                <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="np. 120.50" className="w-full px-4 py-3 rounded-xl border border-input" />
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Opis</label>
                <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="np. Bilety lotnicze" className="w-full px-4 py-3 rounded-xl border border-input" />
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Kto ma uczestniczyć (dłużnicy)</label>
                <div className="grid grid-cols-2 gap-2">
                    {participants.map(p => (
                    <label key={p.id} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                        <input type="checkbox" checked={selectedDebtors.includes(p.id)} onChange={()=>toggleDebtor(p.id)} />
                        <span>{p.name}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Anuluj</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Dodawanie..." : "Dodaj wydatek"}</Button>
                </div>
            </form>
            </motion.div>
        </div>
        </AnimatePresence>
    );
}