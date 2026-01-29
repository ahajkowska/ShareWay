"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getScheduleTranslations } from "../translations";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (date: string) => Promise<void>;
    tripStartDate: string | null;
    tripEndDate: string | null;
}

export default function CreateDayDialog({ open, onOpenChange, onSubmit, tripStartDate, tripEndDate }: Props) {
    const { lang } = useI18n();
    const t = getScheduleTranslations(lang);
    const [date, setDate] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!date) {
            toast.error(t.selectDate);
            return;
        }
        try {
            setSubmitting(true);
            await onSubmit(date);
            setDate("");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || t.createDayError);
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
                        <h3 className="text-lg font-bold">{t.addDay}</h3>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-muted rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">{t.date}</label>
                            {tripStartDate && tripEndDate && (
                                <p className="text-sm text-muted-foreground mb-2">
                                    {t.selectDateBetween} <strong>{new Date(tripStartDate).toLocaleDateString()}</strong> {t.and} <strong>{new Date(tripEndDate).toLocaleDateString()}</strong>
                                </p>
                            )}
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={tripStartDate || undefined}
                                max={tripEndDate || undefined}
                                className="w-full px-4 py-3 rounded-xl border border-input"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={submitting}
                            >
                                {t.cancel}
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? t.adding : t.addDay}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}