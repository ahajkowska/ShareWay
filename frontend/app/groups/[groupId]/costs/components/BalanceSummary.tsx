"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { RefreshCw, ArrowRight } from "lucide-react";
import type { BalanceGraphDto } from "../types";

interface Props {
    balance: BalanceGraphDto | null;
    loading: boolean;
    onRefresh: () => Promise<void>;
}

export default function BalanceSummary({ balance, loading, onRefresh }: Props) {
    if (loading) {
        return (
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Rozliczenia</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-16 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!balance || !balance.settlements || balance.settlements.length === 0) {
        return (
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Rozliczenia</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Brak rozliczeń do wyświetlenia
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Rozliczenia</CardTitle>
                <Button variant="ghost" size="sm" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Lista rozliczeń */}
                {balance.settlements.map((settlement, idx) => (
                    <div
                        key={idx}
                        className="p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-medium text-sm">{settlement.from}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{settlement.to}</span>
                        </div>
                        <p className="text-center text-lg font-bold text-primary">
                            {settlement.amount.toFixed(2)} PLN
                        </p>
                    </div>
                ))}
                
                {/* Suma wydatków */}
                {balance.totalExpenses !== undefined && (
                    <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Suma wydatków:</span>
                            <span className="font-bold">{balance.totalExpenses.toFixed(2)} PLN</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}