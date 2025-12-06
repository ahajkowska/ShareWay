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
  const { t } = useI18n();
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionDescription, setNewOptionDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!voting || !open) return null;

  const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes.length, 0);
  const uniqueVoters = new Set(voting.options.flatMap(opt => opt.votes.map(v => v.userId)));
  
  const sortedOptions = [...voting.options].sort((a, b) => b.votes.length - a.votes.length);
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
                      {t.voting.participants}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{uniqueVoters.size}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.voting.peopleVoted || "osób zagłosowało"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t.voting.votes}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{totalVotes}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.voting.totalVotesCast || "łącznie oddanych głosów"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t.voting.status || "Status"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-green-600">
                      {voting.isActive ? t.voting.active : t.voting.closed}
                    </p>
                    {voting.endsAt && (
                      <p className="text-xs text-muted-foreground">
                        {t.voting.until || "do"} {new Date(voting.endsAt).toLocaleDateString(t.voting.locale)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Najlepsze wyniki */}
              {mostPopular && mostPopular.votes.length > 0 && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🏆 {t.voting.winner || "Zwycięzca"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{mostPopular.text}</p>
                    {mostPopular.description && (
                      <p className="text-sm text-muted-foreground">{mostPopular.description}</p>
                    )}
                    <p className="text-sm mt-2">
                      <strong>{mostPopular.votes.length}</strong> {t.voting.votes}
                      ({totalVotes > 0 ? ((mostPopular.votes.length / totalVotes) * 100).toFixed(0) : 0}%)
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Ranking wszystkich opcji */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t.voting.allOptions || "Wszystkie opcje"}</CardTitle>
                  {voting.allowAddingOptions && !showAddOption && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddOption(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t.voting.addOption}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Formularz dodawania opcji */}
                  {voting.allowAddingOptions && showAddOption && (
                    <form onSubmit={handleAddOption} className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div>
                        <Label htmlFor="optionText">
                          {t.voting.optionName || "Nazwa opcji"} *
                        </Label>
                        <Input
                          id="optionText"
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          placeholder={t.voting.optionPlaceholder || "np. Mykonos"}
                          required
                          disabled={submitting}
                          autoFocus
                        />
                      </div>
                      <div>
                        <Label htmlFor="optionDescription">
                          {t.voting.description} ({t.voting.optional})
                        </Label>
                        <Textarea
                          id="optionDescription"
                          value={newOptionDescription}
                          onChange={(e) => setNewOptionDescription(e.target.value)}
                          placeholder={t.voting.additionalInfo || "Dodatkowe informacje..."}
                          rows={2}
                          disabled={submitting}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={submitting} size="sm">
                          {submitting ? t.voting.adding || "Dodawanie..." : t.voting.add || "Dodaj"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddOption(false);
                            setNewOptionText("");
                            setNewOptionDescription("");
                          }}
                          disabled={submitting}
                          size="sm"
                        >
                          {t.voting.cancel}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Lista opcji */}
                  {sortedOptions.map((option, index) => {
                    const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    
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
                              <p className="text-lg font-bold">{option.votes.length}</p>
                              <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onVote(voting.id, option.id)}
                            >
                              {t.voting.voteButton || "Głosuj"}
                            </Button>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-3" />
                        
                        {/* Lista głosujących */}
                        {option.votes.length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              {t.voting.whoVoted || "Kto głosował?"} ({option.votes.length})
                            </summary>
                            <ul className="mt-2 space-y-1 pl-4">
                              {option.votes.map((vote) => (
                                <li key={vote.id} className="text-xs">
                                  • {vote.userName} - {new Date(vote.votedAt).toLocaleDateString(t.voting.locale)}
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
                    {t.voting.pollInfo || "Informacje o głosowaniu"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{t.voting.createdBy || "Utworzone przez"}: <strong>{voting.createdByName}</strong></p>
                  <p>{t.voting.creationDate || "Data utworzenia"}: <strong>{new Date(voting.createdAt).toLocaleDateString(t.voting.locale)}</strong></p>
                  <p>{t.voting.allowAddingOptions}: <strong>{voting.allowAddingOptions ? t.voting.yes || "Tak" : t.voting.no || "Nie"}</strong></p>
                  <p>{t.voting.allowMultipleVotes}: <strong>{voting.allowMultipleVotes ? t.voting.yes || "Tak" : t.voting.no || "Nie"}</strong></p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}