"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import ChecklistList from "./components/ChecklistList";
import AddItemForm from "./components/AddItemForm";
import type { ChecklistItemDto } from "./types";

export default function ChecklistPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const [items, setItems] = useState<ChecklistItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // MOCK DATA - do odkomentowania gdy backend będzie gotowy
            await new Promise(resolve => setTimeout(resolve, 500)); // Symulacja opóźnienia
            const mockData: ChecklistItemDto[] = [
                {
                    id: "1",
                    text: "Spakować ubrania",
                    isChecked: false,
                    createdBy: "user1",
                    createdByName: "Jan Kowalski",
                    createdAt: new Date("2024-12-01"),
                },
                {
                    id: "2",
                    text: "Zarezerwować hotel",
                    isChecked: true,
                    createdBy: "user2",
                    createdByName: "Anna Nowak",
                    createdAt: new Date("2024-12-02"),
                },
                {
                    id: "3",
                    text: "Kupić bilety lotnicze",
                    isChecked: true,
                    createdBy: "user1",
                    createdByName: "Jan Kowalski",
                    createdAt: new Date("2024-12-03"),
                },
                {
                    id: "4",
                    text: "Zabrać paszporty",
                    isChecked: false,
                    createdBy: "user3",
                    createdByName: "Piotr Wiśniewski",
                    createdAt: new Date("2024-12-04"),
                },
            ];
            setItems(mockData);
            
            // API - zakomentowane do momentu działającego backendu
            // const data = await api.fetchChecklist(groupId);
            // setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error loading checklist:", err);
            setError(err.message || "Błąd ładowania checklisty");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) {
            load();
        }
    }, [groupId]);

    const handleAdd = async (text: string) => {
        try {
            // MOCK - tymczasowe dodawanie lokalnie
            const newItem: ChecklistItemDto = {
                id: `temp-${Date.now()}`,
                text: text,
                isChecked: false,
                createdBy: "current-user",
                createdByName: "Ty",
                createdAt: new Date(),
            };
            setItems(prev => [newItem, ...prev]);
            setIsAddOpen(false);
            
            // API - zakomentowane
            // const newItem = await api.addChecklistItem(groupId, text);
            // setItems(prev => [newItem, ...prev]);
            // setIsAddOpen(false);
        } catch (err: any) {
            console.error("Error adding item:", err);
            alert(err.message || "Nie udało się dodać pozycji");
        }
    };

    const handleToggle = async (itemId: string, newChecked: boolean) => {
        setItems(prev => prev.map(i => (i.id === itemId ? { ...i, isChecked: newChecked } : i)));
        
        try {
            // MOCK
            console.log(`Toggle item ${itemId} to ${newChecked}`);
            
            // PRAWDZIWE API - zakomentowane
            // await api.toggleChecklistItemStatus(itemId, newChecked);
        } catch (err: any) {
            console.error("Error toggling item:", err);
            setItems(prev => prev.map(i => (i.id === itemId ? { ...i, isChecked: !newChecked } : i)));
            alert(err.message || "Nie udało się zapisać zmian");
        }
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
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Lista kontrolna</span>
                                    <Button 
                                        onClick={() => setIsAddOpen(v => !v)} 
                                        className="gap-2"
                                        variant={isAddOpen ? "outline" : "default"}
                                    >
                                        <Plus className="w-4 h-4" /> 
                                        {isAddOpen ? "Anuluj" : "Dodaj pozycję"}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Dodawaj elementy do listy. Zaznaczenia są widoczne dla wszystkich członków grupy.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Add Item Form */}
                    {isAddOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6"
                        >
                            <AddItemForm 
                                onSubmit={handleAdd} 
                                onCancel={() => setIsAddOpen(false)} 
                            />
                        </motion.div>
                    )}

                    {/* Checklist Items */}
                    <ChecklistList
                        items={items}
                        loading={loading}
                        onToggle={handleToggle}
                        onRefresh={load}
                        error={error}
                    />
                </div>
            </main>
        </>
    );
}