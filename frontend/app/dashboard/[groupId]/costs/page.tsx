"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, Wallet, TrendingUp } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getCostsTranslations } from "./translations";
import * as api from "@/lib/api";
import ExpenseList from "./components/ExpenseList";
import CreateExpenseDialog from "./components/CreateExpenseDialog";
import PersonalBalance from "./components/PersonalBalance";
import type { ExpenseDto, BalanceGraphDto, MyBalanceSummaryDto } from "./types";

export default function CostsPage() {
    const { lang } = useI18n();
    const t = getCostsTranslations(lang);
    const params = useParams();
    const tripId = params.groupId as string;
    
    const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
    const [balance, setBalance] = useState<BalanceGraphDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [createExpenseOpen, setCreateExpenseOpen] = useState(false);
    const [myBalance, setMyBalance] = useState<MyBalanceSummaryDto | null>(null);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            
            // MOCK DATA - usuń gdy backend będzie gotowy
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockExpenses: ExpenseDto[] = [
                {
                    id: "exp-1",
                    tripId: tripId,
                    title: "Zakwaterowanie - Hotel Aurora",
                    description: "3 noce, pokoje 2-osobowe",
                    amount: 1200.00,
                    paidBy: "user-1",
                    paidByName: "Jan Kowalski",
                    splitBetween: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Zielińska"],
                    date: "2024-12-15T14:00:00",
                    createdAt: "2024-12-15T14:00:00",
                },
                {
                    id: "exp-2",
                    tripId: tripId,
                    title: "Bilety autokarowe",
                    description: "Warszawa → Zakopane → Warszawa",
                    amount: 480.00,
                    paidBy: "user-2",
                    paidByName: "Anna Nowak",
                    splitBetween: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Zielińska"],
                    date: "2024-12-15T08:00:00",
                    createdAt: "2024-12-15T08:00:00",
                },
                {
                    id: "exp-3",
                    tripId: tripId,
                    title: "Obiad - Restauracja Góralska",
                    description: "Tradycyjna kuchnia podhalańska",
                    amount: 280.00,
                    paidBy: "user-3",
                    paidByName: "Piotr Wiśniewski",
                    splitBetween: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Zielińska"],
                    date: "2024-12-15T18:00:00",
                    createdAt: "2024-12-15T18:00:00",
                },
                {
                    id: "exp-4",
                    tripId: tripId,
                    title: "Bilety na Gubałówkę",
                    description: "Kolejka linowa - 4 osoby",
                    amount: 120.00,
                    paidBy: "user-4",
                    paidByName: "Maria Zielińska",
                    splitBetween: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Zielińska"],
                    date: "2024-12-16T10:00:00",
                    createdAt: "2024-12-16T10:00:00",
                },
                {
                    id: "exp-5",
                    tripId: tripId,
                    title: "Zakupy na ognisko",
                    description: "Kiełbaski, chleb, napoje",
                    amount: 85.00,
                    paidBy: "user-1",
                    paidByName: "Jan Kowalski",
                    splitBetween: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Zielińska"],
                    date: "2024-12-16T17:00:00",
                    createdAt: "2024-12-16T17:00:00",
                },
                {
                    id: "exp-6",
                    tripId: tripId,
                    title: "Śniadania w hotelu",
                    description: "Bufet szwedzki - 3 dni",
                    amount: 360.00,
                    paidBy: "user-2",
                    paidByName: "Anna Nowak",
                    splitBetween: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Zielińska"],
                    date: "2024-12-15T14:30:00",
                    createdAt: "2024-12-15T14:30:00",
                },
            ];
            
            setExpenses(mockExpenses);
            
            // PRAWDZIWE API - odkomentuj gdy backend działa
            // const data = await api.fetchExpenses(tripId);
            // setExpenses(data);
        } catch (err: any) {
            console.error("Error loading expenses:", err);
            alert(err.message || t.loadError);
        } finally {
            setLoading(false);
        }
    };

    const loadBalance = async () => {
        try {
            // MOCK DATA
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockBalance: BalanceGraphDto = {
                settlements: [
                    {
                        from: "Jan Kowalski",
                        to: "Anna Nowak",
                        amount: 45.00,
                    },
                    {
                        from: "Piotr Wiśniewski",
                        to: "Anna Nowak",
                        amount: 135.00,
                    },
                    {
                        from: "Maria Zielińska",
                        to: "Jan Kowalski",
                        amount: 281.25,
                    },
                ],
                totalExpenses: 2525.00,
            };
            
            setBalance(mockBalance);
            
            // PRAWDZIWE API - odkomentuj gdy backend działa
            // const data = await api.fetchBalanceGraph(tripId);
            // setBalance(data);
        } catch (err: any) {
            console.error("Error loading balance:", err);
        }
    };

    const loadMyBalance = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockMyBalance: MyBalanceSummaryDto = {
                myUserId: "user-1",
                myUserName: "Jan Kowalski",
                balances: [
                    {
                        userId: "user-2",
                        userName: "Anna Nowak",
                        balance: 135.00,
                        expenses: [
                            {
                                expenseId: "exp-2",
                                expenseTitle: "Bilety autokarowe",
                                totalAmount: 480.00,
                                myShare: 120.00,
                                iPaid: 0.00,
                                balance: -120.00,
                            },
                            {
                                expenseId: "exp-6",
                                expenseTitle: "Śniadania w hotelu",
                                totalAmount: 360.00,
                                myShare: 90.00,
                                iPaid: 0.00,
                                balance: -90.00,
                            },
                            {
                                expenseId: "exp-1",
                                expenseTitle: "Zakwaterowanie - Hotel Aurora",
                                totalAmount: 1200.00,
                                myShare: 300.00,
                                iPaid: 1200.00,
                                balance: 300.00,
                            },
                            {
                                expenseId: "exp-5",
                                expenseTitle: "Zakupy na ognisko",
                                totalAmount: 85.00,
                                myShare: 21.25,
                                iPaid: 85.00,
                                balance: 21.25,
                            },
                        ],
                    },
                    {
                        userId: "user-3",
                        userName: "Piotr Wiśniewski",
                        balance: 230.00,
                        expenses: [
                            {
                                expenseId: "exp-3",
                                expenseTitle: "Obiad - Restauracja Góralska",
                                totalAmount: 280.00,
                                myShare: 70.00,
                                iPaid: 0.00,
                                balance: -70.00,
                            },
                            {
                                expenseId: "exp-1",
                                expenseTitle: "Zakwaterowanie - Hotel Aurora",
                                totalAmount: 1200.00,
                                myShare: 300.00,
                                iPaid: 1200.00,
                                balance: 300.00,
                            },
                            {
                                expenseId: "exp-5",
                                expenseTitle: "Zakupy na ognisko",
                                totalAmount: 85.00,
                                myShare: 21.25,
                                iPaid: 85.00,
                                balance: 21.25,
                            },
                        ],
                    },
                    {
                        userId: "user-4",
                        userName: "Maria Zielińska",
                        balance: 291.25,
                        expenses: [
                            {
                                expenseId: "exp-4",
                                expenseTitle: "Bilety na Gubałówkę",
                                totalAmount: 120.00,
                                myShare: 30.00,
                                iPaid: 0.00,
                                balance: -30.00,
                            },
                            {
                                expenseId: "exp-1",
                                expenseTitle: "Zakwaterowanie - Hotel Aurora",
                                totalAmount: 1200.00,
                                myShare: 300.00,
                                iPaid: 1200.00,
                                balance: 300.00,
                            },
                            {
                                expenseId: "exp-5",
                                expenseTitle: "Zakupy na ognisko",
                                totalAmount: 85.00,
                                myShare: 21.25,
                                iPaid: 85.00,
                                balance: 21.25,
                            },
                        ],
                    },
                ],
                totalIOweThem: 310.00,
                totalTheyOweMe: 963.75,
            };
            
            setMyBalance(mockMyBalance);
        } catch (err: any) {
            console.error("Error loading my balance:", err);
        }
    };

    useEffect(() => {
        if (tripId) {
            loadExpenses();
            loadBalance();
            loadMyBalance();
        }
    }, [tripId]);

    const handleDeleteExpense = async (expenseId: string) => {
        if (!confirm(t.deleteConfirm)) return;
        
        try {
            // MOCK - usuń lokalnie
            setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
            
            // PRAWDZIWE API
            // await api.deleteExpense(expenseId);
            // await loadExpenses();
            // await loadBalance();
        } catch (err: any) {
            console.error("Error deleting expense:", err);
            alert(err.message || t.deleteError);
        }
    };

    const handleRefreshExpenses = async () => {
        await loadExpenses();
    };

    const handleRefreshBalance = async () => {
        await loadBalance();
    };

    const handleRefreshMyBalance = async () => {
        await loadMyBalance();
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4 max-w-7xl">
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
                                            <Wallet className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold">{t.costSettlements}</h1>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {t.manageExpenses}
                                            </p>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setCreateExpenseOpen(true)} 
                                        className="gap-2"
                                        disabled={loading}
                                    >
                                        <Plus className="w-4 h-4" /> 
                                        {t.newExpense}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            {balance && balance.totalExpenses !== undefined && (
                                <CardContent className="pt-0">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm">
                                            {t.totalExpenses}: <span className="font-bold text-foreground">{balance.totalExpenses.toFixed(2)} {t.pln}</span>
                                        </span>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </motion.div>

                    {/* Main Content - Two Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Expenses List (2/3 width) */}
                        <div className="lg:col-span-2">
                            <ExpenseList 
                                expenses={expenses}
                                loading={loading}
                                onDelete={handleDeleteExpense}
                                onRefresh={handleRefreshExpenses}
                            />
                        </div>

                        {/* Right Column - Balance Summary (1/3 width) */}
                        <div className="lg:col-span-1">
                            <PersonalBalance 
                                myBalance={myBalance} 
                                loading={loading} 
                                onRefresh={handleRefreshMyBalance}
                                tripId={tripId}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Expense Dialog */}
            <CreateExpenseDialog 
                open={createExpenseOpen} 
                onOpenChange={setCreateExpenseOpen} 
                tripId={tripId}
                onCreated={() => {
                    loadExpenses();
                    loadBalance();
                }}
            />
        </>
    );
}