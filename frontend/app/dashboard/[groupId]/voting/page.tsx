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
    const [error, setError] = useState<string | null>(null);
    const [groupName, setGroupName] = useState("");

    const [selectedVoting, setSelectedVoting] = useState<Voting | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        if (groupId) {
            fetchVotings();
        }
    }, [groupId]);

    const fetchVotings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(groupId)) {
                setError("Invalid trip ID format. Please select a valid trip.");
                setLoading(false);
                return;
            }
            
            const data = await api.fetchVotings(groupId);
            setVotings(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching votings:", err);
            setError(err.message || t.loadError || "Failed to load votings");
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
                initialOptions: data.initialOptions,
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

    const handleAddOption = async (votingId: string, optionText: string, description?: string) => {
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
            setVotings(votings.filter(v => v.id !== votingId));
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

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg"
                        >
                            <p className="text-destructive font-medium mb-4">{error}</p>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t.backToGroup || "Back to Dashboard"}
                            </Button>
                        </motion.div>
                    )}

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
