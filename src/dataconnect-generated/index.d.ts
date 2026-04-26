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

export interface CreateUserData {
  user_upsert: User_Key;
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

export interface Reward_Key {
  id: UUIDString;
  __typename?: 'Reward_Key';
}

export interface TaskCategory_Key {
  taskId: UUIDString;
  name: string;
  __typename?: 'TaskCategory_Key';
}

export interface TaskCommentary_Key {
  taskId: UUIDString;
  commentary: string;
  __typename?: 'TaskCommentary_Key';
}

export interface TaskStep_Key {
  taskId: UUIDString;
  step: string;
  __typename?: 'TaskStep_Key';
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

export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileVariables {
  displayName: string;
  photoURL?: string | null;
}

export interface UserAchievement_Key {
  userUid: string;
  achievementId: UUIDString;
  __typename?: 'UserAchievement_Key';
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

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

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

