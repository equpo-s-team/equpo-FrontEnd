import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Achievement_Key {
  id: UUIDString;
  __typename?: 'Achievement_Key';
}

export interface AddTeamMemberData {
  teamMembership_insert: TeamMembership_Key;
}

export interface AddTeamMemberVariables {
  userUid: string;
  teamId: UUIDString;
  role: string;
}

export interface CreateAchievementData {
  achievement_insert: Achievement_Key;
}

export interface CreateAchievementVariables {
  userUid: string;
  name: string;
  description?: string | null;
  iconURL?: string | null;
  unlockedAt: TimestampString;
}

export interface CreateRewardData {
  reward_insert: Reward_Key;
}

export interface CreateRewardVariables {
  name: string;
  cost: number;
  experienceGranted: number;
  type: string;
  isTeamReward: boolean;
  description?: string | null;
  iconURL?: string | null;
}

export interface CreateTeamData {
  team_insert: Team_Key;
}

export interface CreateTeamRewardData {
  teamReward_insert: TeamReward_Key;
}

export interface CreateTeamRewardVariables {
  teamId: UUIDString;
  rewardId: UUIDString;
  dateObtained: TimestampString;
}

export interface CreateTeamVariables {
  name: string;
  virtualCurrency: number;
  description?: string | null;
}

export interface CreateUserData {
  user_upsert: User_Key;
}

export interface CreateUserRewardData {
  userReward_insert: UserReward_Key;
}

export interface CreateUserRewardVariables {
  userUid: string;
  rewardId: UUIDString;
  dateObtained: TimestampString;
}

export interface CreateUserVariables {
  displayName: string;
  photoURL?: string | null;
}

export interface GetUserData {
  users: ({
    uid: string;
    displayName: string;
    level: number;
    experiencePoints: number;
    virtualCurrency: number;
    lastActive: TimestampString;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    photoURL?: string | null;
  } & User_Key)[];
}

export interface GroupMembership_Key {
  userUid: string;
  groupId: UUIDString;
  __typename?: 'GroupMembership_Key';
}

export interface Group_Key {
  id: UUIDString;
  __typename?: 'Group_Key';
}

export interface RedeemUserRewardData {
  userReward_update?: UserReward_Key | null;
}

export interface RedeemUserRewardVariables {
  userUid: string;
  rewardId: UUIDString;
}

export interface Reward_Key {
  id: UUIDString;
  __typename?: 'Reward_Key';
}

export interface TaskCategory_Key {
  taskId: UUIDString;
  __typename?: 'TaskCategory_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface TeamMembership_Key {
  userUid: string;
  teamId: UUIDString;
  __typename?: 'TeamMembership_Key';
}

export interface TeamReward_Key {
  teamId: UUIDString;
  rewardId: UUIDString;
  __typename?: 'TeamReward_Key';
}

export interface Team_Key {
  id: UUIDString;
  __typename?: 'Team_Key';
}

export interface TouchUserLastActiveData {
  user_update?: User_Key | null;
}

export interface UpdateAchievementData {
  achievement_update?: Achievement_Key | null;
}

export interface UpdateAchievementVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  iconURL?: string | null;
}

export interface UpdateRewardData {
  reward_update?: Reward_Key | null;
}

export interface UpdateRewardVariables {
  id: UUIDString;
  name?: string | null;
  cost?: number | null;
  experienceGranted?: number | null;
  description?: string | null;
  iconURL?: string | null;
}

export interface UpdateTeamData {
  team_update?: Team_Key | null;
}

export interface UpdateTeamMemberRoleData {
  teamMembership_update?: TeamMembership_Key | null;
}

export interface UpdateTeamMemberRoleVariables {
  userUid: string;
  teamId: UUIDString;
  role: string;
}

export interface UpdateTeamRewardData {
  teamReward_update?: TeamReward_Key | null;
}

export interface UpdateTeamRewardVariables {
  teamId: UUIDString;
  rewardId: UUIDString;
}

export interface UpdateTeamVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  virtualCurrency?: number | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  displayName?: string | null;
  photoURL?: string | null;
  level?: number | null;
  experiencePoints?: number | null;
  virtualCurrency?: number | null;
}

export interface UserReward_Key {
  userUid: string;
  rewardId: UUIDString;
  __typename?: 'UserReward_Key';
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface TouchUserLastActiveRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<TouchUserLastActiveData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<TouchUserLastActiveData, undefined>;
  operationName: string;
}
export const touchUserLastActiveRef: TouchUserLastActiveRef;

export function touchUserLastActive(): MutationPromise<TouchUserLastActiveData, undefined>;
export function touchUserLastActive(dc: DataConnect): MutationPromise<TouchUserLastActiveData, undefined>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface CreateTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
  operationName: string;
}
export const createTeamRef: CreateTeamRef;

export function createTeam(vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;
export function createTeam(dc: DataConnect, vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;

interface UpdateTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
  operationName: string;
}
export const updateTeamRef: UpdateTeamRef;

export function updateTeam(vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;
export function updateTeam(dc: DataConnect, vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;

interface CreateAchievementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
  operationName: string;
}
export const createAchievementRef: CreateAchievementRef;

export function createAchievement(vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;
export function createAchievement(dc: DataConnect, vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;

interface UpdateAchievementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAchievementVariables): MutationRef<UpdateAchievementData, UpdateAchievementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAchievementVariables): MutationRef<UpdateAchievementData, UpdateAchievementVariables>;
  operationName: string;
}
export const updateAchievementRef: UpdateAchievementRef;

export function updateAchievement(vars: UpdateAchievementVariables): MutationPromise<UpdateAchievementData, UpdateAchievementVariables>;
export function updateAchievement(dc: DataConnect, vars: UpdateAchievementVariables): MutationPromise<UpdateAchievementData, UpdateAchievementVariables>;

interface CreateRewardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRewardVariables): MutationRef<CreateRewardData, CreateRewardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRewardVariables): MutationRef<CreateRewardData, CreateRewardVariables>;
  operationName: string;
}
export const createRewardRef: CreateRewardRef;

export function createReward(vars: CreateRewardVariables): MutationPromise<CreateRewardData, CreateRewardVariables>;
export function createReward(dc: DataConnect, vars: CreateRewardVariables): MutationPromise<CreateRewardData, CreateRewardVariables>;

interface UpdateRewardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRewardVariables): MutationRef<UpdateRewardData, UpdateRewardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRewardVariables): MutationRef<UpdateRewardData, UpdateRewardVariables>;
  operationName: string;
}
export const updateRewardRef: UpdateRewardRef;

export function updateReward(vars: UpdateRewardVariables): MutationPromise<UpdateRewardData, UpdateRewardVariables>;
export function updateReward(dc: DataConnect, vars: UpdateRewardVariables): MutationPromise<UpdateRewardData, UpdateRewardVariables>;

interface CreateUserRewardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserRewardVariables): MutationRef<CreateUserRewardData, CreateUserRewardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserRewardVariables): MutationRef<CreateUserRewardData, CreateUserRewardVariables>;
  operationName: string;
}
export const createUserRewardRef: CreateUserRewardRef;

export function createUserReward(vars: CreateUserRewardVariables): MutationPromise<CreateUserRewardData, CreateUserRewardVariables>;
export function createUserReward(dc: DataConnect, vars: CreateUserRewardVariables): MutationPromise<CreateUserRewardData, CreateUserRewardVariables>;

interface RedeemUserRewardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RedeemUserRewardVariables): MutationRef<RedeemUserRewardData, RedeemUserRewardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RedeemUserRewardVariables): MutationRef<RedeemUserRewardData, RedeemUserRewardVariables>;
  operationName: string;
}
export const redeemUserRewardRef: RedeemUserRewardRef;

export function redeemUserReward(vars: RedeemUserRewardVariables): MutationPromise<RedeemUserRewardData, RedeemUserRewardVariables>;
export function redeemUserReward(dc: DataConnect, vars: RedeemUserRewardVariables): MutationPromise<RedeemUserRewardData, RedeemUserRewardVariables>;

interface CreateTeamRewardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeamRewardVariables): MutationRef<CreateTeamRewardData, CreateTeamRewardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTeamRewardVariables): MutationRef<CreateTeamRewardData, CreateTeamRewardVariables>;
  operationName: string;
}
export const createTeamRewardRef: CreateTeamRewardRef;

export function createTeamReward(vars: CreateTeamRewardVariables): MutationPromise<CreateTeamRewardData, CreateTeamRewardVariables>;
export function createTeamReward(dc: DataConnect, vars: CreateTeamRewardVariables): MutationPromise<CreateTeamRewardData, CreateTeamRewardVariables>;

interface UpdateTeamRewardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamRewardVariables): MutationRef<UpdateTeamRewardData, UpdateTeamRewardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTeamRewardVariables): MutationRef<UpdateTeamRewardData, UpdateTeamRewardVariables>;
  operationName: string;
}
export const updateTeamRewardRef: UpdateTeamRewardRef;

export function updateTeamReward(vars: UpdateTeamRewardVariables): MutationPromise<UpdateTeamRewardData, UpdateTeamRewardVariables>;
export function updateTeamReward(dc: DataConnect, vars: UpdateTeamRewardVariables): MutationPromise<UpdateTeamRewardData, UpdateTeamRewardVariables>;

interface AddTeamMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddTeamMemberVariables): MutationRef<AddTeamMemberData, AddTeamMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddTeamMemberVariables): MutationRef<AddTeamMemberData, AddTeamMemberVariables>;
  operationName: string;
}
export const addTeamMemberRef: AddTeamMemberRef;

export function addTeamMember(vars: AddTeamMemberVariables): MutationPromise<AddTeamMemberData, AddTeamMemberVariables>;
export function addTeamMember(dc: DataConnect, vars: AddTeamMemberVariables): MutationPromise<AddTeamMemberData, AddTeamMemberVariables>;

interface UpdateTeamMemberRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamMemberRoleVariables): MutationRef<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTeamMemberRoleVariables): MutationRef<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
  operationName: string;
}
export const updateTeamMemberRoleRef: UpdateTeamMemberRoleRef;

export function updateTeamMemberRole(vars: UpdateTeamMemberRoleVariables): MutationPromise<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
export function updateTeamMemberRole(dc: DataConnect, vars: UpdateTeamMemberRoleVariables): MutationPromise<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;

