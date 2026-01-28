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
import { toast } from "sonner";
import ExpenseList from "./components/ExpenseList";
import CreateExpenseDialog from "./components/CreateExpenseDialog";
import EditExpenseDialog from "./components/EditExpenseDialog";
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
  const [editExpenseOpen, setEditExpenseOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseDto | null>(null);
  const [myBalance, setMyBalance] = useState<MyBalanceSummaryDto | null>(null);
  const [baseCurrency, setBaseCurrency] = useState<string>("PLN");

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
      toast.error(err.message || t.loadError);
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
      // Fetch balance - backend will calculate with all expenses including settlements
      const data = await api.fetchMyBalance(tripId);
      
      // Use expenses from state (should be fresh if called after loadExpenses)
      // If not available, fetch them
      const allExpenses = expenses.length > 0 ? expenses : await api.fetchExpenses(tripId);
      
      // Filter out settlement expenses from breakdown display
      // Settlements are already calculated in the balance by backend
      // We just don't want to show them in the detailed expense breakdown list
      const regularExpenses = allExpenses.filter(exp => 
        exp.status !== 'SETTLED' && 
        !exp.title.startsWith('Rozliczenie z')
      );
      
      // Calculate detailed expense breakdown for each person
      const balancesWithExpenses = data.balances.map((b) => {
        const expenseBreakdown: any[] = [];
        
        regularExpenses.forEach((expense) => {
          const numberOfPeople = expense.splitBetween.length;
          const sharePerPerson = expense.amount / numberOfPeople;
          
          // Check if both I and the other person are involved in this expense
          const iAmInSplit = expense.splitBetween.includes(data.myUserName);
          const theyAreInSplit = expense.splitBetween.includes(b.userName);
          const iAmPayer = expense.paidBy === data.myUserId;
          const theyArePayer = expense.paidBy === b.userId;
          
          // Only process if both are involved (either in split or as payer)
          const iAmInvolved = iAmInSplit || iAmPayer;
          const theyAreInvolved = theyAreInSplit || theyArePayer;
          
          if (iAmInvolved && theyAreInvolved) {
            // My share of this expense
            const myShare = iAmInSplit ? sharePerPerson : 0;
            // Their share of this expense
            const theirShare = theyAreInSplit ? sharePerPerson : 0;
            
            // How much each person paid
            const iPaid = iAmPayer ? expense.amount : 0;
            const theyPaid = theyArePayer ? expense.amount : 0;
            
            // Calculate balance for THIS expense between me and this person
            // If I paid for their share, they owe me (positive)
            // If they paid for my share, I owe them (negative)
            let balanceForThisExpense = 0;
            
            if (iAmPayer && theyAreInSplit) {
              // I paid, they should pay their share to me
              balanceForThisExpense += theirShare;
            }
            if (theyArePayer && iAmInSplit) {
              // They paid, I should pay my share to them
              balanceForThisExpense -= myShare;
            }
            
            // Round to 2 decimal places to avoid floating point errors
            balanceForThisExpense = Math.round(balanceForThisExpense * 100) / 100;
            
            // Only include if there's a non-zero balance between us for this expense
            if (Math.abs(balanceForThisExpense) > 0.01) {
              expenseBreakdown.push({
                expenseId: expense.id,
                expenseTitle: expense.title,
                totalAmount: Math.round(expense.amount * 100) / 100,
                myShare: Math.round(myShare * 100) / 100,
                iPaid: Math.round(iPaid * 100) / 100,
                balance: balanceForThisExpense,
              });
            }
          }
        });
        
        return {
          userId: b.userId,
          userName: b.userName,
          balance: b.balance,
          expenses: expenseBreakdown,
        };
      });
      
      setMyBalance({
        myUserId: data.myUserId,
        myUserName: data.myUserName,
        balances: balancesWithExpenses.filter(b => Math.abs(b.balance) > 0.01),
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
    toast.info(t.deleteConfirm, {
      action: {
        label: "Usuń",
        onClick: async () => {
          try {
            await api.deleteExpense(expenseId);
            await loadExpenses();
            await loadBalance();
            await loadMyBalance();
            toast.success("Wydatek usunięty");
          } catch (err: any) {
            console.error("Error deleting expense:", err);
            toast.error(err.message || t.deleteError);
          }
        },
      },
    });
  };

  const handleEditExpense = (expense: ExpenseDto) => {
    setExpenseToEdit(expense);
    setEditExpenseOpen(true);
  };

  const handleRefreshExpenses = async () => {
    await loadExpenses();
  };

  const handleRefreshBalance = async () => {
    await loadBalance();
  };

  const handleRefreshMyBalance = async () => {
    // Refresh all data sequentially to ensure consistency
    await loadExpenses();
    await loadBalance();
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
                onEdit={handleEditExpense}
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
          loadMyBalance();
        }}
      />

      {/* Edit Expense Dialog */}
      <EditExpenseDialog
        open={editExpenseOpen}
        onOpenChange={setEditExpenseOpen}
        expense={expenseToEdit}
        tripId={tripId}
        baseCurrency={baseCurrency}
        onUpdated={() => {
          loadExpenses();
          loadBalance();
          loadMyBalance();
        }}
      />
    </>
  );
}
