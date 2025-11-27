"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Vote as VoteIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import VotingList from "./components/VotingList";
import CreateVotingDialog from "./components/CreateVotingDialog";
import VotingDetailsDialog from "./components/VotingDetailsDialog";
import Navbar from "@/app/components/Navbar";
import type { Voting, VotingFormData, Vote, VotingOption } from "./types";

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
      // TODO: Fetch votings for THIS GROUP
      // const response = await fetch(`/api/groups/${groupId}/votings`);
      // const data = await response.json();
      // setVotings(data);
      
      // Mock data - usuń to gdy będzie prawdziwe API
      setVotings([
        {
          id: "1",
          groupId: groupId,
          title: "Dokąd jedziemy?",
          description: "Wybierzmy razem miejsce docelowe",
          createdAt: new Date("2024-11-20"),
          endsAt: new Date("2024-12-01"),
          createdBy: "user-1",
          createdByName: "Jan Kowalski",
          isActive: true,
          allowAddingOptions: true,
          allowMultipleVotes: false,
          showResultsBeforeVoting: true,
          options: [
            { 
              id: "opt-1", 
              text: "Santorini", 
              description: "Piękne widoki i spokój", 
              addedBy: "user-1",
              addedByName: "Jan Kowalski",
              addedAt: new Date("2024-11-20"),
              votes: [
                {
                  id: "vote-1",
                  userId: "user-2",
                  userName: "Anna Nowak",
                  optionId: "opt-1",
                  votedAt: new Date("2024-11-21"),
                }
              ] 
            },
            { 
              id: "opt-2", 
              text: "Ateny", 
              description: "Historia i kultura", 
              addedBy: "user-1",
              addedByName: "Jan Kowalski",
              addedAt: new Date("2024-11-20"),
              votes: [
                {
                  id: "vote-2",
                  userId: "user-3",
                  userName: "Piotr Wiśniewski",
                  optionId: "opt-2",
                  votedAt: new Date("2024-11-22"),
                },
                {
                  id: "vote-3",
                  userId: "user-4",
                  userName: "Maria Kowalczyk",
                  optionId: "opt-2",
                  votedAt: new Date("2024-11-22"),
                }
              ] 
            },
            { 
              id: "opt-3", 
              text: "Kreta", 
              description: "Plaże i przygoda", 
              addedBy: "user-1",
              addedByName: "Jan Kowalski",
              addedAt: new Date("2024-11-20"),
              votes: [] 
            },
          ],
        },
        {
          id: "2",
          groupId: groupId,
          title: "Kiedy wyjeżdżamy?",
          description: "Wybierzmy najlepszy termin dla wszystkich",
          createdAt: new Date("2024-11-21"),
          endsAt: new Date("2024-11-30"),
          createdBy: "user-2",
          createdByName: "Anna Nowak",
          isActive: true,
          allowAddingOptions: false,
          allowMultipleVotes: true,
          showResultsBeforeVoting: true,
          options: [
            { 
              id: "opt-4", 
              text: "1-7 czerwca", 
              addedBy: "user-2",
              addedByName: "Anna Nowak",
              addedAt: new Date("2024-11-21"),
              votes: [
                {
                  id: "vote-4",
                  userId: "user-1",
                  userName: "Jan Kowalski",
                  optionId: "opt-4",
                  votedAt: new Date("2024-11-22"),
                }
              ] 
            },
            { 
              id: "opt-5", 
              text: "15-22 czerwca", 
              addedBy: "user-2",
              addedByName: "Anna Nowak",
              addedAt: new Date("2024-11-21"),
              votes: [] 
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("Error fetching votings:", error);
    } finally {
      setLoading(false);
    }
};

    const handleCreateVoting = async (data: VotingFormData) => {
        try {
        // TODO: POST to API with groupId
        // const response = await fetch(`/api/groups/${groupId}/votings`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        
        await fetchVotings();
        setIsCreateDialogOpen(false);
        } catch (error) {
        console.error("Error creating voting:", error);
        }
    };

    // Funkcja do głosowania (mock)
    const handleVote = async (votingId: string, optionId: string) => {
      try {
        // TODO: POST /api/groups/${groupId}/votings/${votingId}/vote
        
        // Mock - dodaj głos lokalnie
        setVotings(votings.map(voting => {
          if (voting.id === votingId) {
            return {
              ...voting,
              options: voting.options.map(opt => {
                if (opt.id === optionId) {
                  // Dodaj głos
                  const newVote: Vote = {
                    id: `vote-${Date.now()}`,
                    userId: "current-user",
                    userName: "Ty",
                    optionId: optionId,
                    votedAt: new Date(),
                  };
                  return {
                    ...opt,
                    votes: [...opt.votes, newVote],
                  };
                }
                return opt;
              }),
            };
          }
          return voting;
        }));
      } catch (error) {
        console.error("Error voting:", error);
      }
    };

    // Funkcja do dodawania opcji (mock)
    const handleAddOption = async (votingId: string, optionText: string, description?: string) => {
      try {
        // TODO: POST /api/groups/${groupId}/votings/${votingId}/options
        
        // Mock - dodaj opcję lokalnie
        setVotings(votings.map(voting => {
          if (voting.id === votingId) {
            const newOption: VotingOption = {
              id: `opt-${Date.now()}`,
              text: optionText,
              description,
              addedBy: "current-user",
              addedByName: "Ty",
              addedAt: new Date(),
              votes: [],
            };
            return {
              ...voting,
              options: [...voting.options, newOption],
            };
          }
          return voting;
        }));
      } catch (error) {
        console.error("Error adding option:", error);
      }
    };

    // Funkcja do usuwania głosowania (mock)
    const handleDeleteVoting = async (votingId: string) => {
      try {
        // TODO: DELETE /api/groups/${groupId}/votings/${votingId}
        
        // Mock - usuń lokalnie
        setVotings(votings.filter(v => v.id !== votingId));
      } catch (error) {
        console.error("Error deleting voting:", error);
      }
    };

    const handleViewDetails = (voting: Voting) => {
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

// Wszystkie endpointy zawierają groupId w ścieżce:

// GET    /api/groups/:groupId/votings           - lista głosowań w grupie
// POST   /api/groups/:groupId/votings           - nowe głosowanie w grupie
// GET    /api/groups/:groupId/votings/:votingId - szczegóły
// POST   /api/groups/:groupId/votings/:votingId/vote    - głosuj
// PUT    /api/groups/:groupId/votings/:votingId/vote    - zmień głos
// POST   /api/groups/:groupId/votings/:votingId/options - dodaj opcję
// DELETE /api/groups/:groupId/votings/:votingId         - usuń głosowanie (tylko creator)