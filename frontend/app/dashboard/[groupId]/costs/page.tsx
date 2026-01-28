"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, Wallet, TrendingUp, ArrowLeft } from "lucide-react";
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
  const router = useRouter();
  const tripId = params.groupId as string;

  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [balance, setBalance] = useState<BalanceGraphDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [createExpenseOpen, setCreateExpenseOpen] = useState(false);
  const [myBalance, setMyBalance] = useState<MyBalanceSummaryDto | null>(null);
  const [baseCurrency, setBaseCurrency] = useState<string>("PLN"); // Default, will be loaded from trip

  const loadTripInfo = async () => {
    try {
      const tripData = await api.fetchAuth<{ baseCurrency: string }>(
        api.apiUrl(`/trips/${tripId}`),
        {}
      );
      setBaseCurrency(tripData?.baseCurrency || "PLN");
    } catch (err: any) {
      console.error("Error loading trip info:", err);
      setBaseCurrency("PLN");
    }
  };

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await api.fetchExpenses(tripId);
      setExpenses(data || []);
    } catch (err: any) {
      console.error("Error loading expenses:", err);
      alert(err.message || t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const data = await api.fetchBalanceGraph(tripId);
      setBalance(data);
    } catch (err: any) {
      console.error("Error loading balance:", err);
    }
  };

  const loadMyBalance = async () => {
    try {
      const data = await api.fetchMyBalance(tripId);
      // Transform to expected type if needed
      setMyBalance({
        myUserId: data.myUserId,
        myUserName: data.myUserName,
        balances: data.balances.map((b) => ({
          userId: b.userId,
          userName: b.userName,
          balance: b.balance,
          expenses: [], // Backend doesn't provide detailed breakdown yet
        })),
        totalIOweThem: data.totalIOweThem,
        totalTheyOweMe: data.totalTheyOweMe,
      });
    } catch (err: any) {
      console.error("Error loading my balance:", err);
    }
  };

  useEffect(() => {
    if (tripId) {
      loadTripInfo();
      loadExpenses();
      loadBalance();
      loadMyBalance();
    }
  }, [tripId]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      await api.deleteExpense(expenseId);
      await loadExpenses();
      await loadBalance();
      await loadMyBalance();
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
      <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
        <div className="container mx-auto px-4 max-w-7xl">
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
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">
                        {t.costSettlements}
                      </h1>
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
                      {t.totalExpenses}:{" "}
                      <span className="font-bold text-foreground">
                        {balance.totalExpenses.toFixed(2)} {baseCurrency}
                      </span>
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
                baseCurrency={baseCurrency}
              />
            </div>

            {/* Right Column - Balance Summary (1/3 width) */}
            <div className="lg:col-span-1">
              <PersonalBalance
                myBalance={myBalance}
                loading={loading}
                onRefresh={handleRefreshMyBalance}
                tripId={tripId}
                baseCurrency={baseCurrency}
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
        baseCurrency={baseCurrency}
        onCreated={() => {
          loadExpenses();
          loadBalance();
        }}
      />
    </>
  );
}
