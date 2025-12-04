"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import ChecklistItem from "./ChecklistItem";
import type { ChecklistItemDto } from "../types";

interface Props {
    items: ChecklistItemDto[];
    loading: boolean;
    onToggle: (itemId: string, newChecked: boolean) => void;
    onRefresh: () => void;
    error?: string | null;
}

export default function ChecklistList({ items, loading, onToggle, onRefresh, error }: Props) {
    if (loading) {
        return (
            <div className="grid gap-3">
                {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-16 bg-muted rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 space-y-4">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Spróbuj ponownie
                </Button>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Lista jest pusta</p>
                <p className="text-sm">Dodaj pierwszą pozycję używając przycisku powyżej</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3">
            {items.map((item) => (
                <ChecklistItem 
                    key={item.id} 
                    item={item} 
                    onToggle={onToggle} 
                />
            ))}
        </div>
    );
}