"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Vote as VoteIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getVotingTranslations } from "./translations";
import * as api from "@/lib/api";
import VotingList from "./components/VotingList";
import CreateVotingDialog from "./components/CreateVotingDialog";
import VotingDetailsDialog from "./components/VotingDetailsDialog";
import type { Voting, VotingFormData } from "./types";

export default function GroupVotingPage() {
  const { lang } = useI18n();
  const t = getVotingTranslations(lang);
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const [votings, setVotings] = useState<Voting[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");

  const [selectedVoting, setSelectedVoting] = useState<Voting | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchGroupInfo();
      fetchVotings();
    }
  }, [groupId]);

  const fetchGroupInfo = async () => {
    try {
      // Fetch trip details to get the name
      const trip = await api.fetchAuth<{ name: string }>(
        api.apiUrl(`/trips/${groupId}`),
        {}
      );
      setGroupName(trip?.name || "Trip");
    } catch (error) {
      console.error("Error fetching group info:", error);
      setGroupName("Trip");
    }
  };

  const fetchVotings = async () => {
    try {
      setLoading(true);
      const data = (await api.fetchVotings(groupId)) as any[];

      // Transform backend response to frontend Voting type
      const transformedVotings: Voting[] = (data || []).map((vote: any) => ({
        id: vote.id,
        title: vote.title,
        description: vote.description,
        createdBy: vote.createdBy,
        createdAt: new Date(vote.createdAt),
        endsAt: vote.endsAt ? new Date(vote.endsAt) : new Date(),
        status: vote.status?.toLowerCase() || "open",
        options: (vote.options || []).map((opt: any) => ({
          id: opt.id,
          text: opt.text,
          description: opt.description,
          votes: opt.votes || 0,
          voters: opt.voters || [],
        })),
        totalVoters: vote.totalVoters || 0,
        userVote: vote.userVote,
      }));

      setVotings(transformedVotings);
    } catch (error) {
      console.error("Error fetching votings:", error);
      setVotings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVoting = async (data: VotingFormData) => {
    try {
      const payload = {
        question: data.title,
        description: data.description,
        endDate: data.endsAt?.toISOString(),
        options: data.initialOptions,
      };

      await api.createVoting(groupId, payload);
      await fetchVotings();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating voting:", error);
      alert(t.createError);
    }
  };

  const handleVote = async (votingId: string, optionId: string) => {
    try {
      await api.castVote(votingId, [optionId]);
      await fetchVotings();
    } catch (error) {
      console.error("Error voting:", error);
      alert(t.voteError);
    }
  };

  const handleAddOption = async (
    votingId: string,
    optionText: string,
    description?: string
  ) => {
    try {
      await api.addVotingOption(votingId, optionText, description);
      await fetchVotings();
    } catch (error) {
      console.error("Error adding option:", error);
      alert(t.addOptionError);
    }
  };

  const handleDeleteVoting = async (votingId: string) => {
    try {
      if (!confirm(t.deleteConfirm)) return;

      await api.deleteVoting(votingId);
      setVotings(votings.filter((v) => v.id !== votingId));
    } catch (error) {
      console.error("Error deleting voting:", error);
      alert(t.deleteError);
    }
  };

  const handleViewDetails = (voting: Voting) => {
    setSelectedVoting(voting);
    setIsDetailsOpen(true);
  };

  const handleUnvote = async (votingId: string, optionId: string) => {
    try {
      // Wywołujemy funkcję z api.ts, którą wcześniej stworzyliśmy
      await api.removeVote(votingId, optionId);
      
      // Odświeżamy listę głosowań, żeby UI pokazał aktualny stan
      await fetchVotings();
      
      // Jeśli mamy otwarte okno szczegółów, musimy też zaktualizować selectedVoting
      // (ponieważ fetchVotings zmienia stan 'votings', ale nie 'selectedVoting')
      if (selectedVoting && selectedVoting.id === votingId) {
        const updated = votings.find(v => v.id === votingId);
        if (updated) setSelectedVoting(updated);
      }
    } catch (error) {
      console.error("Error removing vote:", error);
      alert("Nie udało się usunąć głosu.");
    }
  };
  
  return (
    <>
      <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.push(`/dashboard/${groupId}`)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToGroup}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 flex items-center gap-3">
                  <VoteIcon className="w-10 h-10 text-primary" />
                  {t.voting}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {t.subtitle}: <strong>{groupName}</strong>
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                {t.createPoll}
              </Button>
            </div>
          </motion.div>

          <VotingList
            votings={votings}
            loading={loading}
            groupId={groupId}
            onVote={handleVote}
            onAddOption={handleAddOption}
            onDelete={handleDeleteVoting}
            onViewDetails={handleViewDetails}
          />
        </div>

        <CreateVotingDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateVoting}
        />

        <VotingDetailsDialog
          voting={selectedVoting}
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onVote={handleVote}
          onAddOption={handleAddOption}
          onUnvote={handleUnvote}
        />
      </main>
    </>
  );
}
