"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface AddOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (optionText: string, description?: string) => Promise<void>;
}

export default function AddOptionDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddOptionDialogProps) {
  const [optionText, setOptionText] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!optionText.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(optionText.trim(), description.trim() || undefined);
      
      // Reset form
      setOptionText("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding option:", error);
      alert("Wystąpił błąd podczas dodawania opcji");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setOptionText("");
      setDescription("");
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md border"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Dodaj nową opcję</h2>
              <button
                onClick={handleClose}
                disabled={submitting}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Treść opcji *
                  </label>
                  <input
                    type="text"
                    value={optionText}
                    onChange={(e) => setOptionText(e.target.value)}
                    placeholder="np. Santorini"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    maxLength={200}
                    autoFocus
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {optionText.length}/200 znaków
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Opis (opcjonalnie)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Dodaj więcej szczegółów..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    maxLength={500}
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {description.length}/500 znaków
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Anuluj
                </Button>
                <Button type="submit" disabled={submitting || !optionText.trim()}>
                  {submitting ? "Dodawanie..." : "Dodaj opcję"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}