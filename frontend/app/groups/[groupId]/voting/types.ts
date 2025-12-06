export interface Vote {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    optionId: string;
    votedAt: Date;
}

export interface VotingOption {
    id: string;
    text: string;
    description?: string;
    votes: number;
    voters: string[];
}

export interface Voting {
    id: string;
    title: string;
    description?: string;
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    allowAddingOptions: boolean;
    allowMultipleVotes: boolean;
    showResultsBeforeVoting: boolean;
    endsAt: Date;
    status: "open" | "closed";
    options: VotingOption[];
    totalVoters: number;
    userVote?: string | null;  // ID opcji na którą użytkownik głosował
}

export interface VotingFormData {
    title: string;
    description: string;
    allowAddingOptions: boolean;
    allowMultipleVotes: boolean;
    showResultsBeforeVoting: boolean;
    endsAt?: Date;
    initialOptions: string[];
}

export interface VotingStats {
    totalVotes: number;
    totalParticipants: number;
    participationRate: number;
    mostPopularOption: VotingOption | null;
}