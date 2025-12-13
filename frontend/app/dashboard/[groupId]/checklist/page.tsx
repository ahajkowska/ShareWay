"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getChecklistTranslations } from "./translations";
import ChecklistList from "./components/ChecklistList";
import AddItemForm from "./components/AddItemForm";
import type { ChecklistItemDto } from "./types";

export default function ChecklistPage() {
    const { lang } = useI18n();
    const t = getChecklistTranslations(lang);
    const params = useParams();
    const router = useRouter();
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
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockData: ChecklistItemDto[] = [
                {
                    id: "1",
                    text: "Spakować ubrania",
                    isChecked: false,
                    createdAt: new Date("2024-12-01"),
                },
                {
                    id: "2",
                    text: "Zarezerwować hotel",
                    isChecked: true,
                    createdAt: new Date("2024-12-02"),
                },
                {
                    id: "3",
                    text: "Kupić bilety lotnicze",
                    isChecked: true,
                    createdAt: new Date("2024-12-03"),
                },
                {
                    id: "4",
                    text: "Zabrać paszporty",
                    isChecked: false,
                    createdAt: new Date("2024-12-04"),
                },
            ];
            setItems(mockData);
            
            // API - zakomentowane do momentu działającego backendu
            // const data = await api.fetchChecklist(groupId);
            // setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error loading checklist:", err);
            setError(err.message || t.loadError);
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
            alert(err.message || t.addError);
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
            alert(err.message || t.toggleError);
        }
    };

    const completedCount = items.filter(i => i.isChecked).length;
    const totalCount = items.length;

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/dashboard/${groupId}`)}
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
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{t.checklistTitle}</span>
                                    <Button 
                                        onClick={() => setIsAddOpen(v => !v)} 
                                        className="gap-2"
                                        variant={isAddOpen ? "outline" : "default"}
                                    >
                                        <Plus className="w-4 h-4" /> 
                                        {isAddOpen ? t.cancel : t.addItem}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {t.checklistDescription}
                                </p>
                                {totalCount > 0 && (
                                    <p className="text-sm font-medium text-primary">
                                        {t.itemsCompleted(completedCount.toString(), totalCount.toString())}
                                    </p>
                                )}
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