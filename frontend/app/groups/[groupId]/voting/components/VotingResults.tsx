"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Crown, Medal } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import type { Voting } from "../types";

interface VotingResultsProps {
  voting: Voting;
  userVote: string | null;
  onChangeVote: (optionId: string) => void;
  canChangeVote?: boolean;
}

export default function VotingResults({
  voting,
  userVote,
  onChangeVote,
  canChangeVote = true,
}: VotingResultsProps) {
  const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes.length, 0);

  const sortedOptions = [...voting.options].sort(
    (a, b) => b.votes.length - a. votes.length
  );

  const maxVotes = sortedOptions[0]?.votes.length || 0;

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 0: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Wyniki głosowania</h2>
        <p className="text-muted-foreground">
          Łącznie oddano <strong>{totalVotes}</strong> głosów
        </p>
      </div>

      <div className="space-y-3">
        {sortedOptions.map((option, index) => {
          const voteCount = option.votes.length;
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          const isUserVote = option.id === userVote;
          const isWinning = voteCount === maxVotes && maxVotes > 0;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card
                className={`overflow-hidden transition-all ${
                  isUserVote ? "ring-2 ring-primary" : ""
                } ${isWinning && index === 0 ? "border-yellow-500 border-2 shadow-lg" : ""}`}
              >
                <CardContent className="p-6">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getPodiumIcon(index)}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 flex-wrap">
                          <span className="line-clamp-2">{option.text}</span>
                          {isUserVote && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full whitespace-nowrap">
                              Twój głos
                            </span>
                          )}
                        </h3>
                        
                        {option.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0 ml-4">
                      <Users className="w-4 h-4" />
                      <span className="font-bold text-lg">{voteCount}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        isWinning && index === 0
                          ?  "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : "bg-gradient-to-r from-primary to-secondary"
                      }`}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      {percentage.toFixed(1)}%
                    </span>

                    {! isUserVote && canChangeVote && voting.isActive && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onChangeVote(option.id)}
                        className="text-xs"
                      >
                        Zmień na tę opcję
                      </Button>
                    )}
                  </div>

                  {/* Voters (optional - show first few) */}
                  {option.votes.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        Głosowali:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.votes.slice(0, 5).map((vote) => (
                          <span
                            key={vote.id}
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {vote.userName}
                          </span>
                        ))}
                        {option.votes.length > 5 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{option.votes.length - 5} więcej
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {totalVotes === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">
            Nikt jeszcze nie zagłosował
          </p>
          <p className="text-sm text-muted-foreground">
            Bądź pierwszy i oddaj swój głos!
          </p>
        </div>
      )}

    </div>
  );
}