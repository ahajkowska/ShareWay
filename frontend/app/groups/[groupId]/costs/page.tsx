"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import * as api from "@/lib/api";
import type { ExpenseDto, BalanceGraphDto } from "./types";
import ExpenseList from "./components/ExpenseList";
import CreateExpenseDialog from "./components/CreateExpenseDialog";
import BalanceSummary from "./components/BalanceSummary";

export default function CostsPage() {
    const params = useParams();
    const tripId = params.groupId as string;
    
    const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
    const [balance, setBalance] = useState<BalanceGraphDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const loadAll = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [expensesData, balanceData] = await Promise.all([
                api.fetchExpenses(tripId),
                api.fetchBalanceGraph(tripId)
            ]);
            
            setExpenses(Array.isArray(expensesData) ? expensesData : []);
            setBalance(balanceData ?? null);
        } catch (err: any) {
            console.error("Error loading costs data:", err);
            setError(err.message || "Nie udało się załadować danych");
            setExpenses([]);
            setBalance(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tripId) {
            loadAll();
        }
    }, [tripId]);

    const handleCreate = async (payload: any) => {
        try {
            await api.createExpense(tripId, payload);
            setCreateOpen(false);
            await loadAll(); // Odśwież dane po dodaniu
        } catch (err: any) {
            console.error("Error creating expense:", err);
            alert(err.message || "Błąd podczas dodawania wydatku");
        }
    };

    const handleDelete = async (expenseId: string) => {
        if (!confirm("Na pewno chcesz usunąć ten wydatek?")) return;
        
        try {
            await api.deleteExpense(expenseId);
            await loadAll(); // Odśwież dane po usunięciu
        } catch (err: any) {
            console.error("Error deleting expense:", err);
            alert(err.message || "Błąd podczas usuwania wydatku");
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Podział kosztów</span>
                                    <Button 
                                        onClick={() => setCreateOpen(true)} 
                                        className="gap-2"
                                        disabled={loading}
                                    >
                                        <Plus className="w-4 h-4" /> 
                                        Nowy wydatek
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Dodawaj wspólne wydatki, a system automatycznie obliczy rozliczenia między uczestnikami.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="mb-6 border-destructive">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3 text-destructive">
                                        <AlertCircle className="w-5 h-5" />
                                        <div className="flex-1">
                                            <p className="font-medium">Wystąpił błąd</p>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={loadAll}
                                        >
                                            Spróbuj ponownie
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Expenses List (2/3 width) */}
                        <div className="lg:col-span-2">
                            <ExpenseList 
                                expenses={expenses} 
                                loading={loading} 
                                onDelete={handleDelete}
                                onRefresh={loadAll}
                            />
                        </div>

                        {/* Balance Summary (1/3 width) */}
                        <div>
                            <BalanceSummary 
                                balance={balance} 
                                loading={loading} 
                                onRefresh={loadAll} 
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Expense Dialog */}
            <CreateExpenseDialog 
                open={createOpen} 
                onOpenChange={setCreateOpen} 
                onSubmit={handleCreate} 
            />
        </>
    );
}