"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getVotingTranslations } from "../translations";
import type { VotingFormData } from "../types";

interface CreateVotingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VotingFormData) => Promise<void>;
}

export default function CreateVotingDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateVotingDialogProps) {
  const { lang } = useI18n();
  const t = getVotingTranslations(lang);
  const [formData, setFormData] = useState<VotingFormData>({
    title: "",
    description: "",
    endsAt: undefined,
    initialOptions: ["", ""],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (!formData.title.trim()) {
      alert(t.titleRequired);
      return;
    }

    const validOptions = formData.initialOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert(t.minOptionsRequired);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        initialOptions: validOptions,
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        endsAt: undefined,
        initialOptions: ["", ""],
      });
    } catch (error) {
      console.error("Error creating voting:", error);
      alert(t.createError);
    } finally {
      setSubmitting(false);
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      initialOptions: [...prev.initialOptions, ""],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.initialOptions.length <= 2) return;
    setFormData(prev => ({
      ...prev,
      initialOptions: prev.initialOptions.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      initialOptions: prev.initialOptions.map((opt, i) => i === index ? value : opt),
    }));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">{t.createPoll}</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t.pollTitle} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t.pollTitlePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t.description} ({t.optional})
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  maxLength={500}
                />
              </div>

              {/* End date */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t.deadline} ({t.optional})
                </label>
                <input
                  type="datetime-local"
                  value={formData.endsAt ? new Date(formData.endsAt).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endsAt: e.target.value ? new Date(e.target.value) : undefined,
                  }))}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  {t.options} ({t.minOptions}) *
                </label>
                <div className="space-y-3">
                  {formData.initialOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`${t.option} ${index + 1}`}
                        className="flex-1 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        maxLength={200}
                      />
                      {formData.initialOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addOption}
                  </Button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                {t.cancel}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? t.creating : t.create}
              </Button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}