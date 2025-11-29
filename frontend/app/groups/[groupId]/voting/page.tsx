"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Vote as VoteIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { fetchAuth, apiUrl } from "@/lib/api";
import VotingList from "./components/VotingList";
import CreateVotingDialog from "./components/CreateVotingDialog";
import VotingDetailsDialog from "./components/VotingDetailsDialog";
import Navbar from "@/app/components/Navbar";
import type { Voting, VotingFormData } from "./types";

export default function GroupVotingPage() {
    const { t } = useI18n();
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
        // TODO: Fetch group details
        // const response = await fetch(`/api/groups/${groupId}`);
        // const data = await response.json();
        // setGroupName(data.name);
        setGroupName("Wyprawa do Grecji"); // Mock
        } catch (error) {
        console.error("Error fetching group info:", error);
        }
    };

  const fetchVotings = async () => {
    try {
      setLoading(true);
      const data = await fetchAuth<Voting[]>(apiUrl(`/api/trips/${groupId}/votes`), {});
      setVotings(data);
    } catch (error) {
      console.error("Error fetching votings:", error);
      setVotings([]); // Pusta tablica w przypadku błędu
    } finally {
      setLoading(false);
    }
  };    const handleCreateVoting = async (data: VotingFormData) => {
        try {
          const payload = {
            title: data.title,
            description: data.description,
            allowAddingOptions: data.allowAddingOptions,
            allowMultipleVotes: data.allowMultipleVotes,
            showResultsBeforeVoting: data.showResultsBeforeVoting,
            endsAt: data.endsAt?.toISOString(),
            options: data.initialOptions.map(text => ({ text })),
          };

      await fetchAuth(apiUrl(`/api/trips/${groupId}/votes`), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
          
          await fetchVotings();
          setIsCreateDialogOpen(false);
        } catch (error) {
          console.error("Error creating voting:", error);
          alert("Nie udało się utworzyć głosowania. Spróbuj ponownie.");
        }
    };

    // Funkcja do głosowania
    const handleVote = async (votingId: string, optionId: string) => {
      try {
      await fetchAuth(apiUrl(`/api/votes/${votingId}/cast`), {
        method: 'POST',
        body: JSON.stringify({ optionIds: [optionId] }),
      });
        
        // Odśwież dane po zagłosowaniu
        await fetchVotings();
      } catch (error) {
        console.error("Error voting:", error);
        alert("Nie udało się oddać głosu. Spróbuj ponownie.");
      }
    };    // Funkcja do dodawania opcji
    const handleAddOption = async (votingId: string, optionText: string, description?: string) => {
      try {
      await fetchAuth(apiUrl(`/api/votes/${votingId}/options`), {
        method: 'POST',
        body: JSON.stringify({ text: optionText, description }),
      });
        
        // Odśwież dane po dodaniu opcji
        await fetchVotings();
      } catch (error) {
        console.error("Error adding option:", error);
        alert("Nie udało się dodać opcji. Spróbuj ponownie.");
      }
    };    // Funkcja do usuwania głosowania (mock)
  const handleDeleteVoting = async (votingId: string) => {
    try {
      if (!confirm('Czy na pewno chcesz usunąć to głosowanie?')) return;

      await fetchAuth(apiUrl(`/api/votes/${votingId}`), {
        method: 'DELETE',
      });

      setVotings(votings.filter(v => v.id !== votingId));
    } catch (error) {
      console.error("Error deleting voting:", error);
      alert("Nie udało się usunąć głosowania. Spróbuj ponownie.");
    }
  };    const handleViewDetails = (voting: Voting) => {
      setSelectedVoting(voting);
      setIsDetailsOpen(true);
    };

    return (
        <>
        <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4">
                {/* Back button */}
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/groups/${groupId}`)}
                    className="mb-6 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Powrót do grupy: {groupName}
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
                            Głosowania
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Podejmujcie decyzje wspólnie w grupie: <strong>{groupName}</strong>
                        </p>
                    </div>
                    
                    <Button
                        size="lg"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nowe głosowanie
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
                />
            </main>
        </>
    );
}