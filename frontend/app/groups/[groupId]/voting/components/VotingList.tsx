"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { useI18n } from "@/app/context/LanguageContext";
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
}

export default function VotingList({ 
  votings, 
  loading, 
  groupId,
  onVote,
  onAddOption,
  onDelete,
  onViewDetails
}: VotingListProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t.voting.loadingPolls || "Ładowanie głosowań..."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (votings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t.voting.noPolls}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sortuj: aktywne najpierw, potem po dacie utworzenia
  const sortedVotings = [...votings].sort((a, b) => {
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeVotings = sortedVotings.filter(v => v.isActive);
  const closedVotings = sortedVotings.filter(v => !v.isActive);

  return (
    <div className="space-y-8">
      {/* Aktywne głosowania */}
      {activeVotings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            {t.voting.activePolls || "Aktywne głosowania"} ({activeVotings.length})
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
              />
            ))}
          </div>
        </div>
      )}

      {/* Zakończone głosowania */}
      {closedVotings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
            {t.voting.closedPolls || "Zakończone głosowania"} ({closedVotings.length})
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}