"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Calendar, Users, TrendingUp, Trash2 } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getVotingTranslations } from "../translations";
import type { Voting } from "../types";

interface VotingCardProps {
  voting: Voting;
  groupId: string;
  index: number;
  onVote: (votingId: string, optionId: string) => Promise<void>;
  onDelete: (votingId: string) => Promise<void>;
  onViewDetails: (voting: Voting) => void;
}

export default function VotingCard({
  voting,
  groupId,
  index,
  onVote,
  onDelete,
  onViewDetails,
}: VotingCardProps) {
  const { lang } = useI18n();
  const t = getVotingTranslations(lang);
  const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes, 0);
  const uniqueVoters = new Set(voting.options.flatMap(opt => opt.voters));
  const sortedOptions = [...voting.options].sort((a, b) => b.votes - a.votes);
  const topOption = sortedOptions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{voting.title}</CardTitle>
              {voting.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {voting.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(voting.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Statystyki */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {uniqueVoters.size} {uniqueVoters.size === 1 
                  ? t.participant 
                  : t.participants}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>
                {totalVotes} {totalVotes === 1 
                  ? t.vote 
                  : t.votes}
              </span>
            </div>
          </div>

          {/* Top opcja */}
          {topOption && topOption.votes > 0 && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">{t.leading}:</p>
              <p className="font-semibold">{topOption.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <Progress 
                  value={totalVotes > 0 ? (topOption.votes / totalVotes) * 100 : 0} 
                  className="flex-1"
                />
                <span className="text-xs font-medium">
                  {topOption.votes}
                </span>
              </div>
            </div>
          )}

          {/* Przyciski akcji */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(voting)}
              className="flex-1"
            >
              {t.viewDetails}
            </Button>
          </div>

          {/* Data zakończenia */}
          {voting.endsAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Calendar className="h-3 w-3" />
              <span>
                {t.endsOn}: {new Date(voting.endsAt).toLocaleDateString(t.locale)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}