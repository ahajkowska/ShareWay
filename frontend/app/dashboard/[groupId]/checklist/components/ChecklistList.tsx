"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getChecklistTranslations } from "../translations";
import ChecklistItem from "./ChecklistItem";
import type { ChecklistItemDto } from "../types";

interface Props {
    items: ChecklistItemDto[];
    loading: boolean;
    onToggle: (itemId: string, newChecked: boolean) => void;
    onDelete?: (itemId: string) => void;
    onRefresh: () => void;
    error?: string | null;
}

export default function ChecklistList({ items, loading, onToggle, onDelete, onRefresh, error }: Props) {
    const { lang } = useI18n();
    const t = getChecklistTranslations(lang);

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
                    {t.tryAgain}
                </Button>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">{t.noItems}</p>
                <p className="text-sm">{t.addFirstItem}</p>
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
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
