"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getChecklistTranslations } from "../translations";
import { toast } from "sonner";

interface Props {
  onSubmit: (text: string) => Promise<void>;
  onCancel?: () => void;
}

export default function AddItemForm({ onSubmit, onCancel }: Props) {
    const { lang } = useI18n();
    const t = getChecklistTranslations(lang);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!text.trim()) {
            toast.error(t.itemPlaceholder);
            return;
        }
        try {
            setSubmitting(true);
            await onSubmit(text.trim());
            setText("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-sm font-medium mb-2">{t.newItem}</label>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t.itemPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    maxLength={200}
                    autoFocus
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                    {submitting ? t.adding : t.add}
                </Button>
                <Button variant="outline" onClick={() => onCancel?.()} disabled={submitting}>
                    {t.cancel}
                </Button>
            </div>
        </form>
    );
}