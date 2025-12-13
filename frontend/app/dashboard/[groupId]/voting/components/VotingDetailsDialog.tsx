"use client";

import { useState } from "react";
import { X, TrendingUp, Users, Calendar, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { useI18n } from "@/app/context/LanguageContext";
import { getVotingTranslations } from "../translations";
import type { Voting } from "../types";

interface VotingDetailsDialogProps {
  voting: Voting | null;
  open: boolean;
  onClose: () => void;
  onVote: (votingId: string, optionId: string) => Promise<void>;
  onAddOption: (votingId: string, optionText: string, description?: string) => Promise<void>;
}

export default function VotingDetailsDialog({ 
  voting, 
  open, 
  onClose,
  onVote,
  onAddOption 
}: VotingDetailsDialogProps) {
  const { lang } = useI18n();
  const t = getVotingTranslations(lang);
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionDescription, setNewOptionDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!voting || !open) return null;

  const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes, 0);
  const uniqueVoters = new Set(voting.options.flatMap(opt => opt.voters));
  
  const sortedOptions = [...voting.options].sort((a, b) => b.votes - a.votes);
  const mostPopular = sortedOptions[0];

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;

    try {
      setSubmitting(true);
      await onAddOption(voting.id, newOptionText.trim(), newOptionDescription.trim() || undefined);
      setNewOptionText("");
      setNewOptionDescription("");
      setShowAddOption(false);
    } catch (error) {
      console.error("Error adding option:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold">{voting.title}</h2>
                {voting.description && (
                  <p className="text-sm text-muted-foreground mt-1">{voting.description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Statystyki ogólne */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t.participants}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{uniqueVoters.size}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.peopleVoted}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t.votes}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{totalVotes}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.totalVotesCast}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t.status}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-green-600">
                      {voting.status === "open" ? t.active : t.closed}
                    </p>
                    {voting.endsAt && (
                      <p className="text-xs text-muted-foreground">
                        {t.until} {new Date(voting.endsAt).toLocaleDateString(t.locale)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Najlepsze wyniki */}
              {mostPopular && mostPopular.votes > 0 && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🏆 {t.winner}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{mostPopular.text}</p>
                    {mostPopular.description && (
                      <p className="text-sm text-muted-foreground">{mostPopular.description}</p>
                    )}
                    <p className="text-sm mt-2">
                      <strong>{mostPopular.votes}</strong> {t.votes}
                      ({totalVotes > 0 ? ((mostPopular.votes / totalVotes) * 100).toFixed(0) : 0}%)
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Ranking wszystkich opcji */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.allOptions}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista opcji */}
                  {sortedOptions.map((option, index) => {
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    
                    return (
                      <div key={option.id} className="space-y-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-muted-foreground">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="font-semibold">{option.text}</p>
                                {option.description && (
                                  <p className="text-xs text-muted-foreground">{option.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <div>
                              <p className="text-lg font-bold">{option.votes}</p>
                              <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onVote(voting.id, option.id)}
                            >
                              {t.voteButton}
                            </Button>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-3" />
                        
                        {/* Lista głosujących */}
                        {option.voters.length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              {t.whoVoted} ({option.voters.length})
                            </summary>
                            <ul className="mt-2 space-y-1 pl-4">
                              {option.voters.map((voterId, idx) => (
                                <li key={`${option.id}-${idx}`} className="text-xs">
                                  • {voterId}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Informacje dodatkowe */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {t.pollInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{t.creationDate}: <strong>{new Date(voting.createdAt).toLocaleDateString(t.locale)}</strong></p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}