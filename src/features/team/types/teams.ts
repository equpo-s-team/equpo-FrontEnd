export interface CreateTeamPayload {
    name: string;
    virtualCurrency: number;
    description?: string | null;
}

export interface UpdateTeamPayload {
    name?: string;
    virtualCurrency?: number;
    description?: string | null;
}

export interface AddTeamMemberPayload {
    userUid: string;
    role?: 'collaborator' | 'spectator' | 'member';
}

export interface UpdateTeamMemberRolePayload {
    role: 'collaborator' | 'spectator' | 'member';
}

export interface CreateTeamRewardPayload {
    rewardId: string;
    dateObtained?: string;
}

export interface CreateAchievementPayload {
    userUid: string;
    name: string;
    description?: string | null;
    iconURL?: string | null;
    unlockedAt?: string;
}