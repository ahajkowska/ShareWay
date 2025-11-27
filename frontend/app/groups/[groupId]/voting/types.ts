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
    addedBy: string;
    addedByName: string;
    addedAt: Date;
    votes: Vote[];
}

export interface Voting {
    id: string;
    groupId: string;
    title: string;
    description?: string;
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    endsAt?: Date;
    isActive: boolean;
    allowAddingOptions: boolean;
    allowMultipleVotes: boolean;
    showResultsBeforeVoting: boolean;
    options: VotingOption[];
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