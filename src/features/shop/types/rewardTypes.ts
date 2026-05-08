export type RewardType = 'team' | 'member' | 'equpo';

export interface MemberLedgerEntry {
  userUid: string;
  displayName: string | null;
  photoUrl: string | null;
  dateObtained: string;
  redeemedAt: string | null;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  experienceGranted: number;
  type: RewardType;
  description: string | null;
  iconURL: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined data from list endpoint
  teamRewardObtainedAt: string | null;
  teamRewardRedeemedAt: string | null;
  memberLedger: MemberLedgerEntry[] | null;
}

export interface ListRewardsResponse {
  rewards: Reward[];
  myMembershipCurrency: number | null;
}

export interface CreateRewardPayload {
  name: string;
  cost: number;
  experienceGranted: number;
  type: 'team' | 'member';
  description?: string;
  iconURL?: string;
}

export interface UpdateRewardPayload {
  name?: string;
  cost?: number;
  experienceGranted?: number;
  description?: string | null;
  iconURL?: string | null;
}
