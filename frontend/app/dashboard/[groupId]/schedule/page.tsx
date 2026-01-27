"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, isToday } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, Calendar, ChevronDown, MapPinned, Sun, Cloud, Sunrise, ArrowLeft, Trash2 } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getScheduleTranslations } from "./translations";
import type { DayDto } from "./types";
import ActivityTimeline from "./components/ActivityTimeline";
import CreateDayDialog from "./components/CreateDayDialog";
import CreateActivityDialog from "./components/CreateActivityDialog";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";

const dayIcons = [Sun, Cloud, Sunrise];

export default function SchedulePage() {
    const params = useParams();
    const router = useRouter();
    const tripId = params.groupId as string;
    const { lang } = useI18n();
    const t = getScheduleTranslations(lang);
    const dateLocale = lang === 'pl' ? pl : enUS;
    
    const [days, setDays] = useState<DayDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createDayOpen, setCreateDayOpen] = useState(false);
    const [createActivityOpen, setCreateActivityOpen] = useState(false);
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const [expandedDayId, setExpandedDayId] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(tripId)) {
                setError(t.invalidTripId || "Invalid trip ID format. Please select a valid trip.");
                setLoading(false);
                return;
            }
            
            const data = await api.fetchPlan(tripId);
            setDays(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error loading schedule:", err);
            setError(err.message || t.loadError);
            setDays([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tripId) {
            load();
        }
    }, [tripId]);

    const handleCreateDay = async (date: string) => {
        try {
            const newDay = await api.createDay(tripId, { date });
            setDays(prev => {
                const currentDays = [...prev, newDay] as DayDto[];
                return currentDays.sort((a, b) => a.date.localeCompare(b.date));
            });
            setCreateDayOpen(false);
        } catch (err: any) {
            console.error("Error creating day:", err);
            alert(err.message || t.createDayError);
        }
    };

    const handleDeleteDay = async (dayId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (!confirm(t.deleteDayConfirm)) return;
        
        try {
            await api.deleteDay(dayId);
            setDays(prev => prev.filter(d => d.id !== dayId));
            if (expandedDayId === dayId) {
                setExpandedDayId(null);
            }
        } catch (err: any) {
            console.error("Error deleting day:", err);
            alert(err.message || t.deleteDayError);
        }
    };

    const handleOpenActivityDialog = (dayId: string) => {
        setSelectedDayId(dayId);
        setCreateActivityOpen(true);
    };

    const toggleDay = (dayId: string) => {
        setExpandedDayId(expandedDayId === dayId ? null : dayId);
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/dashboard/${tripId}`)}
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t.backToGroup}
                    </Button>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="mb-6 border-none shadow-lg bg-gradient-to-r from-primary/5 to-travel-coral/5">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-travel-coral flex items-center justify-center shadow-lg">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold">{t.schedule}</h1>
                                            {days.length > 0 && (
                                                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                                                    <MapPinned className="w-4 h-4" />
                                                    {days.length} {days.length === 1 ? t.day : t.days} {t.daysOfTravel}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setCreateDayOpen(true)} 
                                        className="gap-2"
                                        disabled={loading}
                                    >
                                        <Plus className="w-4 h-4" /> 
                                        {t.addDay}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="h-20 bg-muted rounded-xl animate-pulse" />
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <Card className="border-destructive">
                            <CardContent className="pt-6">
                                <p className="text-destructive text-center">{error}</p>
                                <div className="flex justify-center gap-3 mt-4">
                                    <Button onClick={() => router.push('/dashboard')} variant="outline">
                                        {t.backToGroup}
                                    </Button>
                                    <Button onClick={load} variant="outline">
                                        {t.tryAgain}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {!loading && !error && days.length === 0 && (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-lg font-medium mb-2">{t.noDaysPlanned}</p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {t.addFirstDay}
                                </p>
                                <Button onClick={() => setCreateDayOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t.addDay}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Days Accordion List */}
                    {!loading && !error && days.length > 0 && (
                        <div className="space-y-3">
                            {days.map((day, index) => {
                                const date = new Date(day.date);
                                const isCurrentDay = isToday(date);
                                const isExpanded = expandedDayId === day.id;
                                const DayIcon = dayIcons[index % dayIcons.length];

                                return (
                                    <motion.div
                                        key={day.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className={cn(
                                            "overflow-hidden transition-all duration-200 group",
                                            isCurrentDay && "border-primary/40 shadow-lg ring-2 ring-primary/20",
                                            isExpanded && "shadow-xl"
                                        )}>
                                            {/* Day Header - Clickable */}
                                            <button
                                                onClick={() => toggleDay(day.id)}
                                                className={cn(
                                                    "w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors",
                                                    isCurrentDay && "bg-gradient-to-r from-primary/5 to-travel-coral/5"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                                        isCurrentDay 
                                                            ? "bg-gradient-to-br from-primary to-travel-coral text-white"
                                                            : "bg-muted text-primary"
                                                    )}>
                                                        <DayIcon className="w-6 h-6" />
                                                    </div>
                                                    
                                                    <div className="text-left">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-semibold">
                                                                {format(date, "d MMMM yyyy", { locale: dateLocale })}
                                                            </h3>
                                                            {isCurrentDay && (
                                                                <span className="px-2 py-0.5 bg-travel-coral text-white text-xs font-medium rounded-full">
                                                                    {t.today}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(date, "EEEE", { locale: dateLocale })} · {t.dayNumber} {index + 1} · {day.activities.length} {day.activities.length === 1 ? t.activity : t.activities}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => handleDeleteDay(day.id, e)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
                                                        title={t.deleteDay}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <ChevronDown className={cn(
                                                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                                                        isExpanded && "rotate-180"
                                                    )} />
                                                </div>
                                            </button>

                                            {/* Expanded Content - Timeline */}
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="border-t p-6">
                                                        <ActivityTimeline 
                                                            activities={day.activities}
                                                            onRefresh={load}
                                                        />
                                                        
                                                        {/* Add Activity Button */}
                                                        <Button
                                                            onClick={() => handleOpenActivityDialog(day.id)}
                                                            variant="outline"
                                                            className="w-full mt-4 border-dashed border-2"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            {t.addActivity}
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Dialogs */}
            <CreateDayDialog 
                open={createDayOpen} 
                onOpenChange={setCreateDayOpen} 
                onSubmit={handleCreateDay} 
            />
            
            {selectedDayId && (
                <CreateActivityDialog 
                    open={createActivityOpen} 
                    onOpenChange={setCreateActivityOpen} 
                    dayId={selectedDayId}
                    onCreated={load}
                />
            )}
        </>
    );
}