import {
  type useDataConnectMutationOptions,
  type UseDataConnectMutationResult,
  type useDataConnectQueryOptions,
  type UseDataConnectQueryResult,
} from '@tanstack-query-firebase/react/data-connect';
import { type FirebaseError } from 'firebase/app';
import { type DataConnect } from 'firebase/data-connect';

import {
  type CreateUserData,
  type CreateUserVariables,
  type GetUserData,
  type TouchUserLastActiveData,
} from '../';

export function useCreateUser(
  options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>,
): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(
  dc: DataConnect,
  options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>,
): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useTouchUserLastActive(
  options?: useDataConnectMutationOptions<TouchUserLastActiveData, FirebaseError, void>,
): UseDataConnectMutationResult<TouchUserLastActiveData, undefined>;
export function useTouchUserLastActive(
  dc: DataConnect,
  options?: useDataConnectMutationOptions<TouchUserLastActiveData, FirebaseError, void>,
): UseDataConnectMutationResult<TouchUserLastActiveData, undefined>;

export function useGetUser(
  options?: useDataConnectQueryOptions<GetUserData>,
): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(
  dc: DataConnect,
  options?: useDataConnectQueryOptions<GetUserData>,
): UseDataConnectQueryResult<GetUserData, undefined>;
