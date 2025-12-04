"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";

interface Props {
  onSubmit: (text: string) => Promise<void>;
  onCancel?: () => void;
}

export default function AddItemForm({ onSubmit, onCancel }: Props) {
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!text.trim()) {
            alert("Wpisz treść pozycji");
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
            <label className="block text-sm font-medium mb-2">Nowa pozycja</label>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="np. ładowarka"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={200}
                autoFocus
            />
        </div>

        <div className="flex gap-2">
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Dodawanie..." : "Dodaj"}
            </Button>
            <Button variant="outline" onClick={() => onCancel?.()} disabled={submitting}>
                Anuluj
            </Button>
        </div>
        </form>
    );
}