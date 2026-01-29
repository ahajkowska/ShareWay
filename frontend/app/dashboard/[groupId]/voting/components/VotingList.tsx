"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { useI18n } from "@/app/context/LanguageContext";
import { getVotingTranslations } from "../translations";
import type { Voting } from "../types";
import VotingCard from "./VotingCard";

interface VotingListProps {
  votings: Voting[];
  loading: boolean;
  groupId: string;
  onVote: (votingId: string, optionId: string) => Promise<void>;
  onAddOption: (votingId: string, optionText: string, description?: string) => Promise<void>;
  onDelete: (votingId: string) => Promise<void>;
  onViewDetails: (voting: Voting) => void;
  currentUserId: string | null;
  isOrganizer: boolean;
}

export default function VotingList({ 
  votings, 
  loading, 
  groupId,
  onVote,
  onAddOption,
  onDelete,
  onViewDetails,
  currentUserId,
  isOrganizer
}: VotingListProps) {
  const { lang } = useI18n();
  const t = getVotingTranslations(lang);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(n => (
          <Card key={n}>
            <CardContent className="pt-6">
              <div className="h-64 bg-muted rounded-lg animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (votings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-lg text-muted-foreground mb-2">{t.noPolls}</p>
          <p className="text-sm text-muted-foreground">{t.createFirstPoll}</p>
        </CardContent>
      </Card>
    );
  }

  // Sortuj: aktywne najpierw, potem po dacie utworzenia
  const sortedVotings = [...votings].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "open" ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeVotings = sortedVotings.filter(v => v.status === "open");
  const closedVotings = sortedVotings.filter(v => v.status === "closed");

  return (
    <div className="space-y-8">
      {/* Aktywne głosowania */}
      {activeVotings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            {t.activePolls} ({activeVotings.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeVotings.map((voting, index) => (
              <VotingCard
                key={voting.id}
                voting={voting}
                groupId={groupId}
                index={index}
                onVote={onVote}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                currentUserId={currentUserId}
                isOrganizer={isOrganizer}
              />
            ))}
          </div>
        </div>
      )}

      {/* Zakończone głosowania */}
      {closedVotings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
            {t.closedPolls} ({closedVotings.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {closedVotings.map((voting, index) => (
              <VotingCard
                key={voting.id}
                voting={voting}
                groupId={groupId}
                index={index}
                onVote={onVote}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                currentUserId={currentUserId}
                isOrganizer={isOrganizer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}