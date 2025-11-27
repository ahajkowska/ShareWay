"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import type { VotingOption } from "../types";

interface VotingOptionsProps {
  options: VotingOption[];
  onVote: (optionId: string) => Promise<void>;
  allowMultiple?: boolean;
}

export default function VotingOptions({
  options,
  onVote,
  allowMultiple = false,
}: VotingOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const toggleOption = (optionId: string) => {
    if (allowMultiple) {
      setSelectedOptions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(optionId)) {
          newSet.delete(optionId);
        } else {
          newSet.add(optionId);
        }
        return newSet;
      });
    } else {
      setSelectedOptions(new Set([optionId]));
    }
  };

  const handleSubmit = async () => {
    if (selectedOptions.size === 0) {
      alert("Wybierz przynajmniej jedną opcję");
      return;
    }

    try {
      setSubmitting(true);
      
      if (allowMultiple) {
        // Submit all selected options
        for (const optionId of selectedOptions) {
          await onVote(optionId);
        }
      } else {
        // Submit single option
        const optionId = Array.from(selectedOptions)[0];
        await onVote(optionId);
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Wystąpił błąd podczas głosowania");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Wybierz opcję</h2>
        <p className="text-muted-foreground">
          {allowMultiple
            ? "Możesz wybrać więcej niż jedną opcję"
            : "Wybierz jedną opcję"}
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOptions.has(option.id);

          return (
            <motion.div
              key={option. id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => toggleOption(option.id)}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1">
                        {option.text}
                      </h3>
                      
                      {option.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {option.description}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Dodane przez {option.addedByName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedOptions.size === 0 || submitting}
          className="min-w-[200px]"
        >
          {submitting
            ? "Wysyłanie..."
            : `Zagłosuj (${selectedOptions.size})`}
        </Button>
      </div>
    </div>
  );
}