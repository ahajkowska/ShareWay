"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getChecklistTranslations } from "../translations";
import type { ChecklistItemDto } from "../types";

interface Props {
    item: ChecklistItemDto;
    onToggle: (itemId: string, newChecked: boolean) => void;
    onDelete?: (itemId: string) => void;
}

export default function ChecklistItem({ item, onToggle, onDelete }: Props) {
    const { lang } = useI18n();
    const t = getChecklistTranslations(lang);
    const [localChecked, setLocalChecked] = useState<boolean>(item.isChecked);
    const [saving, setSaving] = useState(false);

    const handleChange = async () => {
        const newChecked = !localChecked;
        setLocalChecked(newChecked);
        setSaving(true);
        try {
            await onToggle(item.id, newChecked);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t.deleteConfirm)) return;
        try {
            setSaving(true);
            await onDelete?.(item.id);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className={`flex items-center gap-3 p-4 rounded-xl border group hover:shadow-sm transition-all ${
                localChecked ? "bg-primary/5 border-primary/20" : "bg-background border-input"
            }`}
        >
            {/* Checkbox */}
            <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <input
                    type="checkbox"
                    checked={localChecked}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-5 h-5 rounded border-input accent-primary"
                    aria-label={`${t.completed}: ${item.text}`}
                />

                <span
                    className={`flex-1 text-sm ${
                        localChecked ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                >
                    {item.text}
                </span>
            </label>

            {/* Delete Button */}
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    disabled={saving}
                    className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all group-hover:text-muted-foreground"
                    title={t.delete}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </motion.div>
    );
}