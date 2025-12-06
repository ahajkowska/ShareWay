"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { RefreshCw, TrendingDown, TrendingUp, User, DollarSign } from "lucide-react";
import { useState } from "react";
import type { MyBalanceSummaryDto, ExpenseBreakdown } from "../types";
import SettleBalanceDialog from "./SettleBalanceDialog";
import PersonBalanceItem from "./PersonalBalanceItem";
import BalanceDonut from "./BalanceDonut";

interface Props {
    myBalance: MyBalanceSummaryDto | null;
    loading: boolean;
    onRefresh: () => Promise<void>;
    tripId: string;
}

export default function PersonalBalance({ myBalance, loading, onRefresh, tripId }: Props) {
    const [settleDialogOpen, setSettleDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<ExpenseBreakdown & { 
        personName: string;
        personUserId: string;
        tripId: string;
    } | null>(null);

    if (loading) {
        return (
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Moje saldo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="h-48 bg-muted rounded-lg animate-pulse" />
                        {[1, 2].map(n => (
                            <div key={n} className="h-20 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!myBalance) {
        return (
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Moje saldo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Brak danych do wyświetlenia
                    </p>
                </CardContent>
            </Card>
        );
    }

    const iOwe = myBalance.balances.filter(b => b.balance < 0);
    const theyOweMe = myBalance.balances.filter(b => b.balance > 0);
    const netBalance = myBalance.totalTheyOweMe - myBalance.totalIOweThem;
    const isSettled = netBalance === 0;

    const handleSettleExpense = (expense: ExpenseBreakdown, personName: string, personUserId: string, tripId: string) => {
        setSelectedExpense({ ...expense, personName, personUserId, tripId });
        setSettleDialogOpen(true);
    };

    return (
        <>
            <Card className="sticky top-24">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Moje saldo
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onRefresh}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    {!isSettled ? (
                        <BalanceDonut 
                            netBalance={netBalance}
                            totalIOweThem={myBalance.totalIOweThem}
                            totalTheyOweMe={myBalance.totalTheyOweMe}
                        />
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                Wszystko rozliczone!
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Nie masz żadnych zaległych płatności
                            </p>
                        </div>
                    )}

                    {/* People I Owe */}
                    {iOwe.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-destructive">
                                <TrendingDown className="w-4 h-4" />
                                Komu jestem winien/winna ({iOwe.length})
                            </h4>
                            <div className="space-y-2">
                                {iOwe.map((person) => (
                                    <PersonBalanceItem 
                                        key={person.userId} 
                                        person={person}
                                        tripId={tripId}
                                        onSettleExpense={(exp, name) => handleSettleExpense(exp, name, person.userId, tripId)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* People Who Owe Me */}
                    {theyOweMe.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                Kto mi jest winien ({theyOweMe.length})
                            </h4>
                            <div className="space-y-2">
                                {theyOweMe.map((person) => (
                                    <PersonBalanceItem 
                                        key={person.userId} 
                                        person={person}
                                        tripId={tripId}
                                        onSettleExpense={(exp, name) => handleSettleExpense(exp, name, person.userId, tripId)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>

            {/* Settle Balance Dialog */}
            {selectedExpense && (
                <SettleBalanceDialog
                    open={settleDialogOpen}
                    onOpenChange={setSettleDialogOpen}
                    expense={selectedExpense}
                    myUserId={myBalance.myUserId}
                    onSettled={onRefresh}
                />
            )}
        </>
    );
}