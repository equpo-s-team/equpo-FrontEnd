import { CreateUserData, CreateUserVariables, TouchUserLastActiveData, UpdateUserData, UpdateUserVariables, GetUserData, CreateTeamData, CreateTeamVariables, UpdateTeamData, UpdateTeamVariables, CreateAchievementData, CreateAchievementVariables, UpdateAchievementData, UpdateAchievementVariables, CreateRewardData, CreateRewardVariables, UpdateRewardData, UpdateRewardVariables, CreateUserRewardData, CreateUserRewardVariables, RedeemUserRewardData, RedeemUserRewardVariables, CreateTeamRewardData, CreateTeamRewardVariables, UpdateTeamRewardData, UpdateTeamRewardVariables, AddTeamMemberData, AddTeamMemberVariables, UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useTouchUserLastActive(options?: useDataConnectMutationOptions<TouchUserLastActiveData, FirebaseError, void>): UseDataConnectMutationResult<TouchUserLastActiveData, undefined>;
export function useTouchUserLastActive(dc: DataConnect, options?: useDataConnectMutationOptions<TouchUserLastActiveData, FirebaseError, void>): UseDataConnectMutationResult<TouchUserLastActiveData, undefined>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables | void>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables | void>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useCreateTeam(options?: useDataConnectMutationOptions<CreateTeamData, FirebaseError, CreateTeamVariables>): UseDataConnectMutationResult<CreateTeamData, CreateTeamVariables>;
export function useCreateTeam(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTeamData, FirebaseError, CreateTeamVariables>): UseDataConnectMutationResult<CreateTeamData, CreateTeamVariables>;

export function useUpdateTeam(options?: useDataConnectMutationOptions<UpdateTeamData, FirebaseError, UpdateTeamVariables>): UseDataConnectMutationResult<UpdateTeamData, UpdateTeamVariables>;
export function useUpdateTeam(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTeamData, FirebaseError, UpdateTeamVariables>): UseDataConnectMutationResult<UpdateTeamData, UpdateTeamVariables>;

export function useCreateAchievement(options?: useDataConnectMutationOptions<CreateAchievementData, FirebaseError, CreateAchievementVariables>): UseDataConnectMutationResult<CreateAchievementData, CreateAchievementVariables>;
export function useCreateAchievement(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAchievementData, FirebaseError, CreateAchievementVariables>): UseDataConnectMutationResult<CreateAchievementData, CreateAchievementVariables>;

export function useUpdateAchievement(options?: useDataConnectMutationOptions<UpdateAchievementData, FirebaseError, UpdateAchievementVariables>): UseDataConnectMutationResult<UpdateAchievementData, UpdateAchievementVariables>;
export function useUpdateAchievement(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAchievementData, FirebaseError, UpdateAchievementVariables>): UseDataConnectMutationResult<UpdateAchievementData, UpdateAchievementVariables>;

export function useCreateReward(options?: useDataConnectMutationOptions<CreateRewardData, FirebaseError, CreateRewardVariables>): UseDataConnectMutationResult<CreateRewardData, CreateRewardVariables>;
export function useCreateReward(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRewardData, FirebaseError, CreateRewardVariables>): UseDataConnectMutationResult<CreateRewardData, CreateRewardVariables>;

export function useUpdateReward(options?: useDataConnectMutationOptions<UpdateRewardData, FirebaseError, UpdateRewardVariables>): UseDataConnectMutationResult<UpdateRewardData, UpdateRewardVariables>;
export function useUpdateReward(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRewardData, FirebaseError, UpdateRewardVariables>): UseDataConnectMutationResult<UpdateRewardData, UpdateRewardVariables>;

export function useCreateUserReward(options?: useDataConnectMutationOptions<CreateUserRewardData, FirebaseError, CreateUserRewardVariables>): UseDataConnectMutationResult<CreateUserRewardData, CreateUserRewardVariables>;
export function useCreateUserReward(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserRewardData, FirebaseError, CreateUserRewardVariables>): UseDataConnectMutationResult<CreateUserRewardData, CreateUserRewardVariables>;

export function useRedeemUserReward(options?: useDataConnectMutationOptions<RedeemUserRewardData, FirebaseError, RedeemUserRewardVariables>): UseDataConnectMutationResult<RedeemUserRewardData, RedeemUserRewardVariables>;
export function useRedeemUserReward(dc: DataConnect, options?: useDataConnectMutationOptions<RedeemUserRewardData, FirebaseError, RedeemUserRewardVariables>): UseDataConnectMutationResult<RedeemUserRewardData, RedeemUserRewardVariables>;

export function useCreateTeamReward(options?: useDataConnectMutationOptions<CreateTeamRewardData, FirebaseError, CreateTeamRewardVariables>): UseDataConnectMutationResult<CreateTeamRewardData, CreateTeamRewardVariables>;
export function useCreateTeamReward(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTeamRewardData, FirebaseError, CreateTeamRewardVariables>): UseDataConnectMutationResult<CreateTeamRewardData, CreateTeamRewardVariables>;

export function useUpdateTeamReward(options?: useDataConnectMutationOptions<UpdateTeamRewardData, FirebaseError, UpdateTeamRewardVariables>): UseDataConnectMutationResult<UpdateTeamRewardData, UpdateTeamRewardVariables>;
export function useUpdateTeamReward(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTeamRewardData, FirebaseError, UpdateTeamRewardVariables>): UseDataConnectMutationResult<UpdateTeamRewardData, UpdateTeamRewardVariables>;

export function useAddTeamMember(options?: useDataConnectMutationOptions<AddTeamMemberData, FirebaseError, AddTeamMemberVariables>): UseDataConnectMutationResult<AddTeamMemberData, AddTeamMemberVariables>;
export function useAddTeamMember(dc: DataConnect, options?: useDataConnectMutationOptions<AddTeamMemberData, FirebaseError, AddTeamMemberVariables>): UseDataConnectMutationResult<AddTeamMemberData, AddTeamMemberVariables>;

export function useUpdateTeamMemberRole(options?: useDataConnectMutationOptions<UpdateTeamMemberRoleData, FirebaseError, UpdateTeamMemberRoleVariables>): UseDataConnectMutationResult<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
export function useUpdateTeamMemberRole(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTeamMemberRoleData, FirebaseError, UpdateTeamMemberRoleVariables>): UseDataConnectMutationResult<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
