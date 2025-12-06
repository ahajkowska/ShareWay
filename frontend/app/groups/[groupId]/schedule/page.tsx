"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format, isToday } from "date-fns";
import { pl } from "date-fns/locale";
import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, Calendar, ChevronDown, MapPinned, Sun, Cloud, Sunrise } from "lucide-react";
import * as api from "@/lib/api";
import type { DayDto } from "./types";
import ActivityTimeline from "./components/ActivityTimeline";
import CreateDayDialog from "./components/CreateDayDialog";
import CreateActivityDialog from "./components/CreateActivityDialog";
import { cn } from "@/lib/utils";

const dayIcons = [Sun, Cloud, Sunrise];

export default function SchedulePage() {
    const params = useParams();
    const tripId = params.groupId as string;
    
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
            
            // MOCK DATA
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockDays: DayDto[] = [
                {
                    id: "day-1",
                    tripId: tripId,
                    date: "2024-12-15",
                    activities: [
                        {
                            id: "act-1",
                            dayId: "day-1",
                            title: "Wyjazd z Warszawy",
                            description: "Zbiórka na dworcu centralnym",
                            startTime: "2024-12-15T08:00:00",
                            endTime: "2024-12-15T08:30:00",
                            location: "Dworzec Centralny, Warszawa",
                            createdBy: "Jan",
                        },
                        {
                            id: "act-2",
                            dayId: "day-1",
                            title: "Przyjazd do hotelu",
                            description: "Zakwaterowanie i odpoczynek",
                            startTime: "2024-12-15T14:00:00",
                            endTime: "2024-12-15T16:00:00",
                            location: "Hotel Aurora, Zakopane",
                            createdBy: "Jan",
                        },
                        {
                            id: "act-3",
                            dayId: "day-1",
                            title: "Obiad w restauracji",
                            description: "Tradycyjna kuchnia podhalańska",
                            startTime: "2024-12-15T18:00:00",
                            endTime: "2024-12-15T20:00:00",
                            location: "Restauracja Góralska, ul. Krupówki 15",
                            createdBy: "Jan",
                        },
                    ],
                },
                {
                    id: "day-2",
                    tripId: tripId,
                    date: "2024-12-16",
                    activities: [
                        {
                            id: "act-4",
                            dayId: "day-2",
                            title: "Śniadanie w hotelu",
                            description: "Bufet szwedzki",
                            startTime: "2024-12-16T08:00:00",
                            endTime: "2024-12-16T09:00:00",
                            location: "Hotel Aurora - restauracja",
                            createdBy: "Jan",
                        },
                        {
                            id: "act-5",
                            dayId: "day-2",
                            title: "Wycieczka na Gubałówkę",
                            description: "Kolejka linowa + spacer po szczycie",
                            startTime: "2024-12-16T10:00:00",
                            endTime: "2024-12-16T14:00:00",
                            location: "Gubałówka",
                            createdBy: "Jan",
                        },
                        {
                            id: "act-6",
                            dayId: "day-2",
                            title: "Wieczór przy ognisku",
                            description: "Pieczenie kiełbasek, gitara",
                            startTime: "2024-12-16T19:00:00",
                            endTime: "2024-12-16T22:00:00",
                            location: "Ognisko przy hotelu",
                            createdBy: "Jan",
                        },
                    ],
                },
                {
                    id: "day-3",
                    tripId: tripId,
                    date: "2024-12-17",
                    activities: [
                        {
                            id: "act-7",
                            dayId: "day-3",
                            title: "Checkout z hotelu",
                            description: "Wymeldowanie, zapakowanie bagaży",
                            startTime: "2024-12-17T10:00:00",
                            endTime: "2024-12-17T11:00:00",
                            location: "Hotel Aurora",
                            createdBy: "Jan",
                        },
                        {
                            id: "act-8",
                            dayId: "day-3",
                            title: "Powrót do Warszawy",
                            description: "Odjazd autokarem",
                            startTime: "2024-12-17T12:00:00",
                            endTime: "2024-12-17T18:00:00",
                            location: "Zakopane → Warszawa",
                            createdBy: "Jan",
                        },
                    ],
                },
            ];
            
            setDays(mockDays);
        } catch (err: any) {
            console.error("Error loading schedule:", err);
            setError(err.message || "Nie udało się załadować harmonogramu");
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
            const newDay: DayDto = {
                id: `day-${Date.now()}`,
                tripId: tripId,
                date: date,
                activities: [],
            };
            setDays(prev => [...prev, newDay].sort((a, b) => a.date.localeCompare(b.date)));
            setCreateDayOpen(false);
        } catch (err: any) {
            console.error("Error creating day:", err);
            alert(err.message || "Błąd podczas dodawania dnia");
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
                                            <h1 className="text-2xl font-bold">Harmonogram wyjazdu</h1>
                                            {days.length > 0 && (
                                                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                                                    <MapPinned className="w-4 h-4" />
                                                    {days.length} {days.length === 1 ? 'dzień' : 'dni'} podróży
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
                                        Dodaj dzień
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
                                <div className="flex justify-center mt-4">
                                    <Button onClick={load} variant="outline">
                                        Spróbuj ponownie
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
                                <p className="text-lg font-medium mb-2">Brak zaplanowanych dni</p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Dodaj pierwszy dzień aby rozpocząć planowanie
                                </p>
                                <Button onClick={() => setCreateDayOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Dodaj dzień
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
                                            "overflow-hidden transition-all duration-200",
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
                                                                {format(date, "d MMMM yyyy", { locale: pl })}
                                                            </h3>
                                                            {isCurrentDay && (
                                                                <span className="px-2 py-0.5 bg-travel-coral text-white text-xs font-medium rounded-full">
                                                                    Dziś
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(date, "EEEE", { locale: pl })} · Dzień {index + 1} · {day.activities.length} {day.activities.length === 1 ? 'aktywność' : 'aktywności'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <ChevronDown className={cn(
                                                    "w-5 h-5 text-muted-foreground transition-transform duration-200",
                                                    isExpanded && "rotate-180"
                                                )} />
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
                                                            Dodaj aktywność
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