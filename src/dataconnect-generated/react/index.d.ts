import { CreateUserData, CreateUserVariables, BackfillUserEmailData, BackfillUserEmailVariables, TouchUserLastActiveData, UpdateUserProfileData, UpdateUserProfileVariables, GetUserData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useBackfillUserEmail(options?: useDataConnectMutationOptions<BackfillUserEmailData, FirebaseError, BackfillUserEmailVariables>): UseDataConnectMutationResult<BackfillUserEmailData, BackfillUserEmailVariables>;
export function useBackfillUserEmail(dc: DataConnect, options?: useDataConnectMutationOptions<BackfillUserEmailData, FirebaseError, BackfillUserEmailVariables>): UseDataConnectMutationResult<BackfillUserEmailData, BackfillUserEmailVariables>;

export function useTouchUserLastActive(options?: useDataConnectMutationOptions<TouchUserLastActiveData, FirebaseError, void>): UseDataConnectMutationResult<TouchUserLastActiveData, undefined>;
export function useTouchUserLastActive(dc: DataConnect, options?: useDataConnectMutationOptions<TouchUserLastActiveData, FirebaseError, void>): UseDataConnectMutationResult<TouchUserLastActiveData, undefined>;

export function useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
export function useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
