"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Vote as VoteIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getVotingTranslations } from "./translations";
import { fetchAuth, apiUrl } from "@/lib/api";
import VotingList from "./components/VotingList";
import CreateVotingDialog from "./components/CreateVotingDialog";
import VotingDetailsDialog from "./components/VotingDetailsDialog";
import Navbar from "@/app/components/Navbar";
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
            
            // MOCK DATA - usuń gdy backend będzie gotowy
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockVotings: Voting[] = [
                {
                    id: "vote-1",
                    title: "Gdzie nocować w Atenach?",
                    description: "Wybierz preferowaną dzielnicę do pobytu",
                    createdBy: "user-1",
                    createdAt: new Date("2024-12-10"),
                    endsAt: new Date("2024-12-20"),
                    status: "open",
                    options: [
                        {
                            id: "opt-1",
                            text: "Plaka (centrum historyczne)",
                            description: "Blisko zabytków, turystyczne",
                            votes: 3,
                            voters: ["user-1", "user-2", "user-4"],
                        },
                        {
                            id: "opt-2",
                            text: "Kolonaki (nowoczesny)",
                            description: "Modne lokale, dobre restauracje",
                            votes: 2,
                            voters: ["user-3"],
                        },
                        {
                            id: "opt-3",
                            text: "Monastiraki (bohemski)",
                            description: "Bazary, atmosfera, bardziej autentyczne",
                            votes: 1,
                            voters: ["user-5"],
                        },
                    ],
                    totalVoters: 6,
                    userVote: "opt-1",
                },
                {
                    id: "vote-2",
                    title: "Ile dni powinniśmy spędzić w Grecji?",
                    description: "Głosuj na preferowaną długość wyjazdu",
                    createdBy: "user-2",
                    createdAt: new Date("2024-12-08"),
                    endsAt: new Date("2024-12-18"),
                    status: "open",
                    options: [
                        {
                            id: "opt-4",
                            text: "5 dni",
                            description: "",
                            votes: 1,
                            voters: ["user-1"],
                        },
                        {
                            id: "opt-5",
                            text: "7 dni",
                            description: "",
                            votes: 4,
                            voters: ["user-2", "user-3", "user-4", "user-5"],
                        },
                        {
                            id: "opt-6",
                            text: "10 dni",
                            description: "",
                            votes: 2,
                            voters: ["user-6", "user-7"],
                        },
                    ],
                    totalVoters: 7,
                    userVote: "opt-5",
                },
                {
                    id: "vote-3",
                    title: "Jaki jest Twój budżet na całą podróż?",
                    description: "Pomóż nam zaplanować wydatki",
                    createdBy: "user-3",
                    createdAt: new Date("2024-12-09"),
                    endsAt: new Date("2024-12-22"),
                    status: "open",
                    options: [
                        {
                            id: "opt-7",
                            text: "1000 - 1500 PLN",
                            description: "Budżet oszczędny",
                            votes: 2,
                            voters: ["user-1", "user-3"],
                        },
                        {
                            id: "opt-8",
                            text: "1500 - 2500 PLN",
                            description: "Budżet średni",
                            votes: 3,
                            voters: ["user-2", "user-4", "user-5"],
                        },
                        {
                            id: "opt-9",
                            text: "2500+ PLN",
                            description: "Budżet wyższy, więcej komfortu",
                            votes: 1,
                            voters: ["user-6"],
                        },
                    ],
                    totalVoters: 6,
                    userVote: null,
                },
                {
                    id: "vote-4",
                    title: "Jakie atrakcje chcesz odwiedzić?",
                    description: "Zaznacz wszystkie interesujące Cię miejsca",
                    createdBy: "user-4",
                    createdAt: new Date("2024-12-05"),
                    endsAt: new Date("2024-12-25"),
                    status: "open",
                    options: [
                        {
                            id: "opt-10",
                            text: "Akropol i Partenon",
                            description: "Najsławniejszy zabytek",
                            votes: 6,
                            voters: ["user-1", "user-2", "user-3", "user-4", "user-5", "user-6"],
                        },
                        {
                            id: "opt-11",
                            text: "Santorini",
                            description: "Wyspa z zachodami słońca",
                            votes: 4,
                            voters: ["user-1", "user-2", "user-4", "user-5"],
                        },
                        {
                            id: "opt-12",
                            text: "Delphi",
                            description: "Starożytne ruiny",
                            votes: 2,
                            voters: ["user-3", "user-6"],
                        },
                        {
                            id: "opt-13",
                            text: "Plaże",
                            description: "Relaks nad Morzem Egejskim",
                            votes: 5,
                            voters: ["user-1", "user-2", "user-3", "user-4", "user-6"],
                        },
                    ],
                    totalVoters: 6,
                    userVote: "opt-10",
                },
                {
                    id: "vote-5",
                    title: "Kiedy najlepiej wyjechać?",
                    description: "Głosuj na preferowany miesiąc",
                    createdBy: "user-5",
                    createdAt: new Date("2024-12-01"),
                    endsAt: new Date("2024-12-15"),
                    status: "closed",
                    options: [
                        {
                            id: "opt-14",
                            text: "Czerwiec",
                            description: "",
                            votes: 3,
                            voters: ["user-1", "user-3", "user-5"],
                        },
                        {
                            id: "opt-15",
                            text: "Lipiec",
                            description: "",
                            votes: 4,
                            voters: ["user-2", "user-4", "user-6", "user-7"],
                        },
                        {
                            id: "opt-16",
                            text: "Sierpień",
                            description: "",
                            votes: 2,
                            voters: ["user-1", "user-2"],
                        },
                    ],
                    totalVoters: 9,
                    userVote: "opt-14",
                },
            ];
            
            setVotings(mockVotings);
            
            // PRAWDZIWE API - odkomentuj gdy backend działa
            // const data = await fetchAuth<Voting[]>(apiUrl(`/api/trips/${groupId}/votes`), {});
            // setVotings(data);
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
                title: data.title,
                description: data.description,
                endsAt: data.endsAt?.toISOString(),
                options: data.initialOptions.map(text => ({ text })),
            };

            // MOCK - tylko odśwież
            console.log("Creating voting:", payload);
            await new Promise(resolve => setTimeout(resolve, 500));
            await fetchVotings();
            setIsCreateDialogOpen(false);

            // PRAWDZIWE API
            // await fetchAuth(apiUrl(`/api/trips/${groupId}/votes`), {
            //     method: 'POST',
            //     body: JSON.stringify(payload),
            // });
            // await fetchVotings();
            // setIsCreateDialogOpen(false);
        } catch (error) {
            console.error("Error creating voting:", error);
            alert(t.createError);
        }
    };

    const handleVote = async (votingId: string, optionId: string) => {
        try {
            // MOCK
            console.log(`Voting for option ${optionId} in voting ${votingId}`);
            setVotings(prevVotings =>
                prevVotings.map(v =>
                    v.id === votingId
                        ? {
                            ...v,
                            userVote: optionId,
                            options: v.options.map(o =>
                                o.id === optionId
                                    ? { ...o, votes: o.votes + 1, voters: [...o.voters, "current-user"] }
                                    : o
                            ),
                        }
                        : v
                )
            );

            // PRAWDZIWE API
            // await fetchAuth(apiUrl(`/api/votes/${votingId}/cast`), {
            //     method: 'POST',
            //     body: JSON.stringify({ optionIds: [optionId] }),
            // });
            // await fetchVotings();
        } catch (error) {
            console.error("Error voting:", error);
            alert(t.voteError);
        }
    };

    const handleAddOption = async (votingId: string, optionText: string, description?: string) => {
        try {
            // MOCK
            console.log(`Adding option "${optionText}" to voting ${votingId}`);
            await new Promise(resolve => setTimeout(resolve, 300));
            await fetchVotings();

            // PRAWDZIWE API
            // await fetchAuth(apiUrl(`/api/votes/${votingId}/options`), {
            //     method: 'POST',
            //     body: JSON.stringify({ text: optionText, description }),
            // });
            // await fetchVotings();
        } catch (error) {
            console.error("Error adding option:", error);
            alert(t.addOptionError);
        }
    };

    const handleDeleteVoting = async (votingId: string) => {
        try {
            if (!confirm(t.deleteConfirm)) return;

            // MOCK
            console.log(`Deleting voting ${votingId}`);
            setVotings(votings.filter(v => v.id !== votingId));

            // PRAWDZIWE API
            // await fetchAuth(apiUrl(`/api/votes/${votingId}`), {
            //     method: 'DELETE',
            // });
            // setVotings(votings.filter(v => v.id !== votingId));
        } catch (error) {
            console.error("Error deleting voting:", error);
            alert(t.deleteError);
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
                />
            </main>
        </>
    );
}
