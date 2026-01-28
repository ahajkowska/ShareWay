"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getScheduleTranslations } from "../translations";
import type { ActivityDto, UpdateActivityDto } from "../types";
import * as api from "@/lib/api";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activity: ActivityDto;
    onUpdated?: () => void;
}

export default function EditActivityDialog({ open, onOpenChange, activity, onUpdated }: Props) {
    const { lang } = useI18n();
    const t = getScheduleTranslations(lang);
    const [title, setTitle] = useState(activity.title);
    const [description, setDescription] = useState(activity.description ?? "");
    const [startTime, setStartTime] = useState(activity.startTime ?? "");
    const [endTime, setEndTime] = useState(activity.endTime ?? "");
    const [activityLocation, setActivityLocation] = useState(activity.location ?? "");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setTitle(activity.title);
        setDescription(activity.description ?? "");
        setStartTime(activity.startTime ?? "");
        setEndTime(activity.endTime ?? "");
        setActivityLocation(activity.location ?? "");
    }, [activity]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim()) {
            alert(t.titleRequired);
            return;
        }
        try {
            setSubmitting(true);
            const payload: UpdateActivityDto = {
                title: title.trim(),
                description: description.trim() || undefined,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                location: activityLocation.trim() || undefined,
            };
            await api.updateActivity(activity.id, payload);
            onUpdated?.();
            onOpenChange(false);
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            alert(err.message || t.updateError);
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
                    className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg"
                >
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-lg font-bold">{t.editActivity}</h3>
                        <button 
                            onClick={() => onOpenChange(false)} 
                            className="p-2 hover:bg-muted rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">{t.activityTitle}</label>
                            <input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="w-full px-4 py-3 rounded-xl border border-input" 
                                autoFocus 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">{t.description} ({t.optional})</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={3} 
                                className="w-full px-4 py-3 rounded-xl border border-input resize-none" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-2">{t.startTime}</label>
                                <input 
                                    type="time" 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)} 
                                    className="w-full px-4 py-3 rounded-xl border border-input" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{t.endTime}</label>
                                <input 
                                    type="time" 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)} 
                                    className="w-full px-4 py-3 rounded-xl border border-input" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">{t.location}</label>
                            <input 
                                value={activityLocation} 
                                onChange={(e) => setActivityLocation(e.target.value)} 
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
                                {submitting ? t.updating : t.saveChanges}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
