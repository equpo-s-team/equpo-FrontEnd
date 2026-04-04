# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*TouchUserLastActive*](#touchuserlastactive)
  - [*UpdateUser*](#updateuser)
  - [*CreateTeam*](#createteam)
  - [*UpdateTeam*](#updateteam)
  - [*CreateAchievement*](#createachievement)
  - [*UpdateAchievement*](#updateachievement)
  - [*CreateReward*](#createreward)
  - [*UpdateReward*](#updatereward)
  - [*CreateUserReward*](#createuserreward)
  - [*RedeemUserReward*](#redeemuserreward)
  - [*CreateTeamReward*](#createteamreward)
  - [*UpdateTeamReward*](#updateteamreward)
  - [*AddTeamMember*](#addteammember)
  - [*UpdateTeamMemberRole*](#updateteammemberrole)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  photoURL?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_upsert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  photoURL: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., photoURL: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  photoURL: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., photoURL: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## TouchUserLastActive
You can execute the `TouchUserLastActive` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
touchUserLastActive(): MutationPromise<TouchUserLastActiveData, undefined>;

interface TouchUserLastActiveRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<TouchUserLastActiveData, undefined>;
}
export const touchUserLastActiveRef: TouchUserLastActiveRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
touchUserLastActive(dc: DataConnect): MutationPromise<TouchUserLastActiveData, undefined>;

interface TouchUserLastActiveRef {
  ...
  (dc: DataConnect): MutationRef<TouchUserLastActiveData, undefined>;
}
export const touchUserLastActiveRef: TouchUserLastActiveRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the touchUserLastActiveRef:
```typescript
const name = touchUserLastActiveRef.operationName;
console.log(name);
```

### Variables
The `TouchUserLastActive` mutation has no variables.
### Return Type
Recall that executing the `TouchUserLastActive` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TouchUserLastActiveData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TouchUserLastActiveData {
  user_update?: User_Key | null;
}
```
### Using `TouchUserLastActive`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, touchUserLastActive } from '@dataconnect/generated';


// Call the `touchUserLastActive()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await touchUserLastActive();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await touchUserLastActive(dataConnect);

console.log(data.user_update);

// Or, you can use the `Promise` API.
touchUserLastActive().then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `TouchUserLastActive`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, touchUserLastActiveRef } from '@dataconnect/generated';


// Call the `touchUserLastActiveRef()` function to get a reference to the mutation.
const ref = touchUserLastActiveRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = touchUserLastActiveRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  displayName?: string | null;
  photoURL?: string | null;
  level?: number | null;
  experiencePoints?: number | null;
  virtualCurrency?: number | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  displayName: ..., // optional
  photoURL: ..., // optional
  level: ..., // optional
  experiencePoints: ..., // optional
  virtualCurrency: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ displayName: ..., photoURL: ..., level: ..., experiencePoints: ..., virtualCurrency: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  displayName: ..., // optional
  photoURL: ..., // optional
  level: ..., // optional
  experiencePoints: ..., // optional
  virtualCurrency: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ displayName: ..., photoURL: ..., level: ..., experiencePoints: ..., virtualCurrency: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateTeam
You can execute the `CreateTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTeam(vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;

interface CreateTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
}
export const createTeamRef: CreateTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTeam(dc: DataConnect, vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;

interface CreateTeamRef {
  ...
  (dc: DataConnect, vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
}
export const createTeamRef: CreateTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTeamRef:
```typescript
const name = createTeamRef.operationName;
console.log(name);
```

### Variables
The `CreateTeam` mutation requires an argument of type `CreateTeamVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTeamVariables {
  name: string;
  virtualCurrency: number;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTeamData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTeamData {
  team_insert: Team_Key;
}
```
### Using `CreateTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTeam, CreateTeamVariables } from '@dataconnect/generated';

// The `CreateTeam` mutation requires an argument of type `CreateTeamVariables`:
const createTeamVars: CreateTeamVariables = {
  name: ..., 
  virtualCurrency: ..., 
  description: ..., // optional
};

// Call the `createTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTeam(createTeamVars);
// Variables can be defined inline as well.
const { data } = await createTeam({ name: ..., virtualCurrency: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTeam(dataConnect, createTeamVars);

console.log(data.team_insert);

// Or, you can use the `Promise` API.
createTeam(createTeamVars).then((response) => {
  const data = response.data;
  console.log(data.team_insert);
});
```

### Using `CreateTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTeamRef, CreateTeamVariables } from '@dataconnect/generated';

// The `CreateTeam` mutation requires an argument of type `CreateTeamVariables`:
const createTeamVars: CreateTeamVariables = {
  name: ..., 
  virtualCurrency: ..., 
  description: ..., // optional
};

// Call the `createTeamRef()` function to get a reference to the mutation.
const ref = createTeamRef(createTeamVars);
// Variables can be defined inline as well.
const ref = createTeamRef({ name: ..., virtualCurrency: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTeamRef(dataConnect, createTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.team_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.team_insert);
});
```

## UpdateTeam
You can execute the `UpdateTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTeam(vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;

interface UpdateTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
}
export const updateTeamRef: UpdateTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTeam(dc: DataConnect, vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;

interface UpdateTeamRef {
  ...
  (dc: DataConnect, vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
}
export const updateTeamRef: UpdateTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTeamRef:
```typescript
const name = updateTeamRef.operationName;
console.log(name);
```

### Variables
The `UpdateTeam` mutation requires an argument of type `UpdateTeamVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTeamVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  virtualCurrency?: number | null;
}
```
### Return Type
Recall that executing the `UpdateTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTeamData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTeamData {
  team_update?: Team_Key | null;
}
```
### Using `UpdateTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTeam, UpdateTeamVariables } from '@dataconnect/generated';

// The `UpdateTeam` mutation requires an argument of type `UpdateTeamVariables`:
const updateTeamVars: UpdateTeamVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  virtualCurrency: ..., // optional
};

// Call the `updateTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTeam(updateTeamVars);
// Variables can be defined inline as well.
const { data } = await updateTeam({ id: ..., name: ..., description: ..., virtualCurrency: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTeam(dataConnect, updateTeamVars);

console.log(data.team_update);

// Or, you can use the `Promise` API.
updateTeam(updateTeamVars).then((response) => {
  const data = response.data;
  console.log(data.team_update);
});
```

### Using `UpdateTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTeamRef, UpdateTeamVariables } from '@dataconnect/generated';

// The `UpdateTeam` mutation requires an argument of type `UpdateTeamVariables`:
const updateTeamVars: UpdateTeamVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  virtualCurrency: ..., // optional
};

// Call the `updateTeamRef()` function to get a reference to the mutation.
const ref = updateTeamRef(updateTeamVars);
// Variables can be defined inline as well.
const ref = updateTeamRef({ id: ..., name: ..., description: ..., virtualCurrency: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTeamRef(dataConnect, updateTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.team_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.team_update);
});
```

## CreateAchievement
You can execute the `CreateAchievement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAchievement(vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;

interface CreateAchievementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
}
export const createAchievementRef: CreateAchievementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAchievement(dc: DataConnect, vars: CreateAchievementVariables): MutationPromise<CreateAchievementData, CreateAchievementVariables>;

interface CreateAchievementRef {
  ...
  (dc: DataConnect, vars: CreateAchievementVariables): MutationRef<CreateAchievementData, CreateAchievementVariables>;
}
export const createAchievementRef: CreateAchievementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAchievementRef:
```typescript
const name = createAchievementRef.operationName;
console.log(name);
```

### Variables
The `CreateAchievement` mutation requires an argument of type `CreateAchievementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAchievementVariables {
  userUid: string;
  name: string;
  description?: string | null;
  iconURL?: string | null;
  unlockedAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateAchievement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAchievementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAchievementData {
  achievement_insert: Achievement_Key;
}
```
### Using `CreateAchievement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAchievement, CreateAchievementVariables } from '@dataconnect/generated';

// The `CreateAchievement` mutation requires an argument of type `CreateAchievementVariables`:
const createAchievementVars: CreateAchievementVariables = {
  userUid: ..., 
  name: ..., 
  description: ..., // optional
  iconURL: ..., // optional
  unlockedAt: ..., 
};

// Call the `createAchievement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAchievement(createAchievementVars);
// Variables can be defined inline as well.
const { data } = await createAchievement({ userUid: ..., name: ..., description: ..., iconURL: ..., unlockedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAchievement(dataConnect, createAchievementVars);

console.log(data.achievement_insert);

// Or, you can use the `Promise` API.
createAchievement(createAchievementVars).then((response) => {
  const data = response.data;
  console.log(data.achievement_insert);
});
```

### Using `CreateAchievement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAchievementRef, CreateAchievementVariables } from '@dataconnect/generated';

// The `CreateAchievement` mutation requires an argument of type `CreateAchievementVariables`:
const createAchievementVars: CreateAchievementVariables = {
  userUid: ..., 
  name: ..., 
  description: ..., // optional
  iconURL: ..., // optional
  unlockedAt: ..., 
};

// Call the `createAchievementRef()` function to get a reference to the mutation.
const ref = createAchievementRef(createAchievementVars);
// Variables can be defined inline as well.
const ref = createAchievementRef({ userUid: ..., name: ..., description: ..., iconURL: ..., unlockedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAchievementRef(dataConnect, createAchievementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.achievement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.achievement_insert);
});
```

## UpdateAchievement
You can execute the `UpdateAchievement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAchievement(vars: UpdateAchievementVariables): MutationPromise<UpdateAchievementData, UpdateAchievementVariables>;

interface UpdateAchievementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAchievementVariables): MutationRef<UpdateAchievementData, UpdateAchievementVariables>;
}
export const updateAchievementRef: UpdateAchievementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAchievement(dc: DataConnect, vars: UpdateAchievementVariables): MutationPromise<UpdateAchievementData, UpdateAchievementVariables>;

interface UpdateAchievementRef {
  ...
  (dc: DataConnect, vars: UpdateAchievementVariables): MutationRef<UpdateAchievementData, UpdateAchievementVariables>;
}
export const updateAchievementRef: UpdateAchievementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAchievementRef:
```typescript
const name = updateAchievementRef.operationName;
console.log(name);
```

### Variables
The `UpdateAchievement` mutation requires an argument of type `UpdateAchievementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAchievementVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  iconURL?: string | null;
}
```
### Return Type
Recall that executing the `UpdateAchievement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAchievementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAchievementData {
  achievement_update?: Achievement_Key | null;
}
```
### Using `UpdateAchievement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAchievement, UpdateAchievementVariables } from '@dataconnect/generated';

// The `UpdateAchievement` mutation requires an argument of type `UpdateAchievementVariables`:
const updateAchievementVars: UpdateAchievementVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  iconURL: ..., // optional
};

// Call the `updateAchievement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAchievement(updateAchievementVars);
// Variables can be defined inline as well.
const { data } = await updateAchievement({ id: ..., name: ..., description: ..., iconURL: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAchievement(dataConnect, updateAchievementVars);

console.log(data.achievement_update);

// Or, you can use the `Promise` API.
updateAchievement(updateAchievementVars).then((response) => {
  const data = response.data;
  console.log(data.achievement_update);
});
```

### Using `UpdateAchievement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAchievementRef, UpdateAchievementVariables } from '@dataconnect/generated';

// The `UpdateAchievement` mutation requires an argument of type `UpdateAchievementVariables`:
const updateAchievementVars: UpdateAchievementVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  iconURL: ..., // optional
};

// Call the `updateAchievementRef()` function to get a reference to the mutation.
const ref = updateAchievementRef(updateAchievementVars);
// Variables can be defined inline as well.
const ref = updateAchievementRef({ id: ..., name: ..., description: ..., iconURL: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAchievementRef(dataConnect, updateAchievementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.achievement_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.achievement_update);
});
```

## CreateReward
You can execute the `CreateReward` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReward(vars: CreateRewardVariables): MutationPromise<CreateRewardData, CreateRewardVariables>;

interface CreateRewardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRewardVariables): MutationRef<CreateRewardData, CreateRewardVariables>;
}
export const createRewardRef: CreateRewardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReward(dc: DataConnect, vars: CreateRewardVariables): MutationPromise<CreateRewardData, CreateRewardVariables>;

interface CreateRewardRef {
  ...
  (dc: DataConnect, vars: CreateRewardVariables): MutationRef<CreateRewardData, CreateRewardVariables>;
}
export const createRewardRef: CreateRewardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRewardRef:
```typescript
const name = createRewardRef.operationName;
console.log(name);
```

### Variables
The `CreateReward` mutation requires an argument of type `CreateRewardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRewardVariables {
  name: string;
  cost: number;
  experienceGranted: number;
  type: string;
  isTeamReward: boolean;
  description?: string | null;
  iconURL?: string | null;
}
```
### Return Type
Recall that executing the `CreateReward` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRewardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRewardData {
  reward_insert: Reward_Key;
}
```
### Using `CreateReward`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReward, CreateRewardVariables } from '@dataconnect/generated';

// The `CreateReward` mutation requires an argument of type `CreateRewardVariables`:
const createRewardVars: CreateRewardVariables = {
  name: ..., 
  cost: ..., 
  experienceGranted: ..., 
  type: ..., 
  isTeamReward: ..., 
  description: ..., // optional
  iconURL: ..., // optional
};

// Call the `createReward()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReward(createRewardVars);
// Variables can be defined inline as well.
const { data } = await createReward({ name: ..., cost: ..., experienceGranted: ..., type: ..., isTeamReward: ..., description: ..., iconURL: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReward(dataConnect, createRewardVars);

console.log(data.reward_insert);

// Or, you can use the `Promise` API.
createReward(createRewardVars).then((response) => {
  const data = response.data;
  console.log(data.reward_insert);
});
```

### Using `CreateReward`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRewardRef, CreateRewardVariables } from '@dataconnect/generated';

// The `CreateReward` mutation requires an argument of type `CreateRewardVariables`:
const createRewardVars: CreateRewardVariables = {
  name: ..., 
  cost: ..., 
  experienceGranted: ..., 
  type: ..., 
  isTeamReward: ..., 
  description: ..., // optional
  iconURL: ..., // optional
};

// Call the `createRewardRef()` function to get a reference to the mutation.
const ref = createRewardRef(createRewardVars);
// Variables can be defined inline as well.
const ref = createRewardRef({ name: ..., cost: ..., experienceGranted: ..., type: ..., isTeamReward: ..., description: ..., iconURL: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRewardRef(dataConnect, createRewardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reward_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reward_insert);
});
```

## UpdateReward
You can execute the `UpdateReward` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReward(vars: UpdateRewardVariables): MutationPromise<UpdateRewardData, UpdateRewardVariables>;

interface UpdateRewardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRewardVariables): MutationRef<UpdateRewardData, UpdateRewardVariables>;
}
export const updateRewardRef: UpdateRewardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReward(dc: DataConnect, vars: UpdateRewardVariables): MutationPromise<UpdateRewardData, UpdateRewardVariables>;

interface UpdateRewardRef {
  ...
  (dc: DataConnect, vars: UpdateRewardVariables): MutationRef<UpdateRewardData, UpdateRewardVariables>;
}
export const updateRewardRef: UpdateRewardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRewardRef:
```typescript
const name = updateRewardRef.operationName;
console.log(name);
```

### Variables
The `UpdateReward` mutation requires an argument of type `UpdateRewardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRewardVariables {
  id: UUIDString;
  name?: string | null;
  cost?: number | null;
  experienceGranted?: number | null;
  description?: string | null;
  iconURL?: string | null;
}
```
### Return Type
Recall that executing the `UpdateReward` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRewardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRewardData {
  reward_update?: Reward_Key | null;
}
```
### Using `UpdateReward`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReward, UpdateRewardVariables } from '@dataconnect/generated';

// The `UpdateReward` mutation requires an argument of type `UpdateRewardVariables`:
const updateRewardVars: UpdateRewardVariables = {
  id: ..., 
  name: ..., // optional
  cost: ..., // optional
  experienceGranted: ..., // optional
  description: ..., // optional
  iconURL: ..., // optional
};

// Call the `updateReward()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReward(updateRewardVars);
// Variables can be defined inline as well.
const { data } = await updateReward({ id: ..., name: ..., cost: ..., experienceGranted: ..., description: ..., iconURL: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReward(dataConnect, updateRewardVars);

console.log(data.reward_update);

// Or, you can use the `Promise` API.
updateReward(updateRewardVars).then((response) => {
  const data = response.data;
  console.log(data.reward_update);
});
```

### Using `UpdateReward`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRewardRef, UpdateRewardVariables } from '@dataconnect/generated';

// The `UpdateReward` mutation requires an argument of type `UpdateRewardVariables`:
const updateRewardVars: UpdateRewardVariables = {
  id: ..., 
  name: ..., // optional
  cost: ..., // optional
  experienceGranted: ..., // optional
  description: ..., // optional
  iconURL: ..., // optional
};

// Call the `updateRewardRef()` function to get a reference to the mutation.
const ref = updateRewardRef(updateRewardVars);
// Variables can be defined inline as well.
const ref = updateRewardRef({ id: ..., name: ..., cost: ..., experienceGranted: ..., description: ..., iconURL: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRewardRef(dataConnect, updateRewardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reward_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reward_update);
});
```

## CreateUserReward
You can execute the `CreateUserReward` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserReward(vars: CreateUserRewardVariables): MutationPromise<CreateUserRewardData, CreateUserRewardVariables>;

interface CreateUserRewardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserRewardVariables): MutationRef<CreateUserRewardData, CreateUserRewardVariables>;
}
export const createUserRewardRef: CreateUserRewardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserReward(dc: DataConnect, vars: CreateUserRewardVariables): MutationPromise<CreateUserRewardData, CreateUserRewardVariables>;

interface CreateUserRewardRef {
  ...
  (dc: DataConnect, vars: CreateUserRewardVariables): MutationRef<CreateUserRewardData, CreateUserRewardVariables>;
}
export const createUserRewardRef: CreateUserRewardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRewardRef:
```typescript
const name = createUserRewardRef.operationName;
console.log(name);
```

### Variables
The `CreateUserReward` mutation requires an argument of type `CreateUserRewardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserRewardVariables {
  userUid: string;
  rewardId: UUIDString;
  dateObtained: TimestampString;
}
```
### Return Type
Recall that executing the `CreateUserReward` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserRewardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserRewardData {
  userReward_insert: UserReward_Key;
}
```
### Using `CreateUserReward`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserReward, CreateUserRewardVariables } from '@dataconnect/generated';

// The `CreateUserReward` mutation requires an argument of type `CreateUserRewardVariables`:
const createUserRewardVars: CreateUserRewardVariables = {
  userUid: ..., 
  rewardId: ..., 
  dateObtained: ..., 
};

// Call the `createUserReward()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserReward(createUserRewardVars);
// Variables can be defined inline as well.
const { data } = await createUserReward({ userUid: ..., rewardId: ..., dateObtained: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserReward(dataConnect, createUserRewardVars);

console.log(data.userReward_insert);

// Or, you can use the `Promise` API.
createUserReward(createUserRewardVars).then((response) => {
  const data = response.data;
  console.log(data.userReward_insert);
});
```

### Using `CreateUserReward`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRewardRef, CreateUserRewardVariables } from '@dataconnect/generated';

// The `CreateUserReward` mutation requires an argument of type `CreateUserRewardVariables`:
const createUserRewardVars: CreateUserRewardVariables = {
  userUid: ..., 
  rewardId: ..., 
  dateObtained: ..., 
};

// Call the `createUserRewardRef()` function to get a reference to the mutation.
const ref = createUserRewardRef(createUserRewardVars);
// Variables can be defined inline as well.
const ref = createUserRewardRef({ userUid: ..., rewardId: ..., dateObtained: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRewardRef(dataConnect, createUserRewardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userReward_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userReward_insert);
});
```

## RedeemUserReward
You can execute the `RedeemUserReward` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
redeemUserReward(vars: RedeemUserRewardVariables): MutationPromise<RedeemUserRewardData, RedeemUserRewardVariables>;

interface RedeemUserRewardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RedeemUserRewardVariables): MutationRef<RedeemUserRewardData, RedeemUserRewardVariables>;
}
export const redeemUserRewardRef: RedeemUserRewardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
redeemUserReward(dc: DataConnect, vars: RedeemUserRewardVariables): MutationPromise<RedeemUserRewardData, RedeemUserRewardVariables>;

interface RedeemUserRewardRef {
  ...
  (dc: DataConnect, vars: RedeemUserRewardVariables): MutationRef<RedeemUserRewardData, RedeemUserRewardVariables>;
}
export const redeemUserRewardRef: RedeemUserRewardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the redeemUserRewardRef:
```typescript
const name = redeemUserRewardRef.operationName;
console.log(name);
```

### Variables
The `RedeemUserReward` mutation requires an argument of type `RedeemUserRewardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RedeemUserRewardVariables {
  userUid: string;
  rewardId: UUIDString;
}
```
### Return Type
Recall that executing the `RedeemUserReward` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RedeemUserRewardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RedeemUserRewardData {
  userReward_update?: UserReward_Key | null;
}
```
### Using `RedeemUserReward`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, redeemUserReward, RedeemUserRewardVariables } from '@dataconnect/generated';

// The `RedeemUserReward` mutation requires an argument of type `RedeemUserRewardVariables`:
const redeemUserRewardVars: RedeemUserRewardVariables = {
  userUid: ..., 
  rewardId: ..., 
};

// Call the `redeemUserReward()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await redeemUserReward(redeemUserRewardVars);
// Variables can be defined inline as well.
const { data } = await redeemUserReward({ userUid: ..., rewardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await redeemUserReward(dataConnect, redeemUserRewardVars);

console.log(data.userReward_update);

// Or, you can use the `Promise` API.
redeemUserReward(redeemUserRewardVars).then((response) => {
  const data = response.data;
  console.log(data.userReward_update);
});
```

### Using `RedeemUserReward`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, redeemUserRewardRef, RedeemUserRewardVariables } from '@dataconnect/generated';

// The `RedeemUserReward` mutation requires an argument of type `RedeemUserRewardVariables`:
const redeemUserRewardVars: RedeemUserRewardVariables = {
  userUid: ..., 
  rewardId: ..., 
};

// Call the `redeemUserRewardRef()` function to get a reference to the mutation.
const ref = redeemUserRewardRef(redeemUserRewardVars);
// Variables can be defined inline as well.
const ref = redeemUserRewardRef({ userUid: ..., rewardId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = redeemUserRewardRef(dataConnect, redeemUserRewardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userReward_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userReward_update);
});
```

## CreateTeamReward
You can execute the `CreateTeamReward` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTeamReward(vars: CreateTeamRewardVariables): MutationPromise<CreateTeamRewardData, CreateTeamRewardVariables>;

interface CreateTeamRewardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeamRewardVariables): MutationRef<CreateTeamRewardData, CreateTeamRewardVariables>;
}
export const createTeamRewardRef: CreateTeamRewardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTeamReward(dc: DataConnect, vars: CreateTeamRewardVariables): MutationPromise<CreateTeamRewardData, CreateTeamRewardVariables>;

interface CreateTeamRewardRef {
  ...
  (dc: DataConnect, vars: CreateTeamRewardVariables): MutationRef<CreateTeamRewardData, CreateTeamRewardVariables>;
}
export const createTeamRewardRef: CreateTeamRewardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTeamRewardRef:
```typescript
const name = createTeamRewardRef.operationName;
console.log(name);
```

### Variables
The `CreateTeamReward` mutation requires an argument of type `CreateTeamRewardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTeamRewardVariables {
  teamId: UUIDString;
  rewardId: UUIDString;
  dateObtained: TimestampString;
}
```
### Return Type
Recall that executing the `CreateTeamReward` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTeamRewardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTeamRewardData {
  teamReward_insert: TeamReward_Key;
}
```
### Using `CreateTeamReward`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTeamReward, CreateTeamRewardVariables } from '@dataconnect/generated';

// The `CreateTeamReward` mutation requires an argument of type `CreateTeamRewardVariables`:
const createTeamRewardVars: CreateTeamRewardVariables = {
  teamId: ..., 
  rewardId: ..., 
  dateObtained: ..., 
};

// Call the `createTeamReward()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTeamReward(createTeamRewardVars);
// Variables can be defined inline as well.
const { data } = await createTeamReward({ teamId: ..., rewardId: ..., dateObtained: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTeamReward(dataConnect, createTeamRewardVars);

console.log(data.teamReward_insert);

// Or, you can use the `Promise` API.
createTeamReward(createTeamRewardVars).then((response) => {
  const data = response.data;
  console.log(data.teamReward_insert);
});
```

### Using `CreateTeamReward`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTeamRewardRef, CreateTeamRewardVariables } from '@dataconnect/generated';

// The `CreateTeamReward` mutation requires an argument of type `CreateTeamRewardVariables`:
const createTeamRewardVars: CreateTeamRewardVariables = {
  teamId: ..., 
  rewardId: ..., 
  dateObtained: ..., 
};

// Call the `createTeamRewardRef()` function to get a reference to the mutation.
const ref = createTeamRewardRef(createTeamRewardVars);
// Variables can be defined inline as well.
const ref = createTeamRewardRef({ teamId: ..., rewardId: ..., dateObtained: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTeamRewardRef(dataConnect, createTeamRewardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamReward_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamReward_insert);
});
```

## UpdateTeamReward
You can execute the `UpdateTeamReward` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTeamReward(vars: UpdateTeamRewardVariables): MutationPromise<UpdateTeamRewardData, UpdateTeamRewardVariables>;

interface UpdateTeamRewardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamRewardVariables): MutationRef<UpdateTeamRewardData, UpdateTeamRewardVariables>;
}
export const updateTeamRewardRef: UpdateTeamRewardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTeamReward(dc: DataConnect, vars: UpdateTeamRewardVariables): MutationPromise<UpdateTeamRewardData, UpdateTeamRewardVariables>;

interface UpdateTeamRewardRef {
  ...
  (dc: DataConnect, vars: UpdateTeamRewardVariables): MutationRef<UpdateTeamRewardData, UpdateTeamRewardVariables>;
}
export const updateTeamRewardRef: UpdateTeamRewardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTeamRewardRef:
```typescript
const name = updateTeamRewardRef.operationName;
console.log(name);
```

### Variables
The `UpdateTeamReward` mutation requires an argument of type `UpdateTeamRewardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTeamRewardVariables {
  teamId: UUIDString;
  rewardId: UUIDString;
}
```
### Return Type
Recall that executing the `UpdateTeamReward` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTeamRewardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTeamRewardData {
  teamReward_update?: TeamReward_Key | null;
}
```
### Using `UpdateTeamReward`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTeamReward, UpdateTeamRewardVariables } from '@dataconnect/generated';

// The `UpdateTeamReward` mutation requires an argument of type `UpdateTeamRewardVariables`:
const updateTeamRewardVars: UpdateTeamRewardVariables = {
  teamId: ..., 
  rewardId: ..., 
};

// Call the `updateTeamReward()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTeamReward(updateTeamRewardVars);
// Variables can be defined inline as well.
const { data } = await updateTeamReward({ teamId: ..., rewardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTeamReward(dataConnect, updateTeamRewardVars);

console.log(data.teamReward_update);

// Or, you can use the `Promise` API.
updateTeamReward(updateTeamRewardVars).then((response) => {
  const data = response.data;
  console.log(data.teamReward_update);
});
```

### Using `UpdateTeamReward`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTeamRewardRef, UpdateTeamRewardVariables } from '@dataconnect/generated';

// The `UpdateTeamReward` mutation requires an argument of type `UpdateTeamRewardVariables`:
const updateTeamRewardVars: UpdateTeamRewardVariables = {
  teamId: ..., 
  rewardId: ..., 
};

// Call the `updateTeamRewardRef()` function to get a reference to the mutation.
const ref = updateTeamRewardRef(updateTeamRewardVars);
// Variables can be defined inline as well.
const ref = updateTeamRewardRef({ teamId: ..., rewardId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTeamRewardRef(dataConnect, updateTeamRewardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamReward_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamReward_update);
});
```

## AddTeamMember
You can execute the `AddTeamMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addTeamMember(vars: AddTeamMemberVariables): MutationPromise<AddTeamMemberData, AddTeamMemberVariables>;

interface AddTeamMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddTeamMemberVariables): MutationRef<AddTeamMemberData, AddTeamMemberVariables>;
}
export const addTeamMemberRef: AddTeamMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addTeamMember(dc: DataConnect, vars: AddTeamMemberVariables): MutationPromise<AddTeamMemberData, AddTeamMemberVariables>;

interface AddTeamMemberRef {
  ...
  (dc: DataConnect, vars: AddTeamMemberVariables): MutationRef<AddTeamMemberData, AddTeamMemberVariables>;
}
export const addTeamMemberRef: AddTeamMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addTeamMemberRef:
```typescript
const name = addTeamMemberRef.operationName;
console.log(name);
```

### Variables
The `AddTeamMember` mutation requires an argument of type `AddTeamMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddTeamMemberVariables {
  userUid: string;
  teamId: UUIDString;
  role: string;
}
```
### Return Type
Recall that executing the `AddTeamMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddTeamMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddTeamMemberData {
  teamMembership_insert: TeamMembership_Key;
}
```
### Using `AddTeamMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addTeamMember, AddTeamMemberVariables } from '@dataconnect/generated';

// The `AddTeamMember` mutation requires an argument of type `AddTeamMemberVariables`:
const addTeamMemberVars: AddTeamMemberVariables = {
  userUid: ..., 
  teamId: ..., 
  role: ..., 
};

// Call the `addTeamMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addTeamMember(addTeamMemberVars);
// Variables can be defined inline as well.
const { data } = await addTeamMember({ userUid: ..., teamId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addTeamMember(dataConnect, addTeamMemberVars);

console.log(data.teamMembership_insert);

// Or, you can use the `Promise` API.
addTeamMember(addTeamMemberVars).then((response) => {
  const data = response.data;
  console.log(data.teamMembership_insert);
});
```

### Using `AddTeamMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addTeamMemberRef, AddTeamMemberVariables } from '@dataconnect/generated';

// The `AddTeamMember` mutation requires an argument of type `AddTeamMemberVariables`:
const addTeamMemberVars: AddTeamMemberVariables = {
  userUid: ..., 
  teamId: ..., 
  role: ..., 
};

// Call the `addTeamMemberRef()` function to get a reference to the mutation.
const ref = addTeamMemberRef(addTeamMemberVars);
// Variables can be defined inline as well.
const ref = addTeamMemberRef({ userUid: ..., teamId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addTeamMemberRef(dataConnect, addTeamMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamMembership_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMembership_insert);
});
```

## UpdateTeamMemberRole
You can execute the `UpdateTeamMemberRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTeamMemberRole(vars: UpdateTeamMemberRoleVariables): MutationPromise<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;

interface UpdateTeamMemberRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamMemberRoleVariables): MutationRef<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
}
export const updateTeamMemberRoleRef: UpdateTeamMemberRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTeamMemberRole(dc: DataConnect, vars: UpdateTeamMemberRoleVariables): MutationPromise<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;

interface UpdateTeamMemberRoleRef {
  ...
  (dc: DataConnect, vars: UpdateTeamMemberRoleVariables): MutationRef<UpdateTeamMemberRoleData, UpdateTeamMemberRoleVariables>;
}
export const updateTeamMemberRoleRef: UpdateTeamMemberRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTeamMemberRoleRef:
```typescript
const name = updateTeamMemberRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateTeamMemberRole` mutation requires an argument of type `UpdateTeamMemberRoleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTeamMemberRoleVariables {
  userUid: string;
  teamId: UUIDString;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateTeamMemberRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTeamMemberRoleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTeamMemberRoleData {
  teamMembership_update?: TeamMembership_Key | null;
}
```
### Using `UpdateTeamMemberRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTeamMemberRole, UpdateTeamMemberRoleVariables } from '@dataconnect/generated';

// The `UpdateTeamMemberRole` mutation requires an argument of type `UpdateTeamMemberRoleVariables`:
const updateTeamMemberRoleVars: UpdateTeamMemberRoleVariables = {
  userUid: ..., 
  teamId: ..., 
  role: ..., 
};

// Call the `updateTeamMemberRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTeamMemberRole(updateTeamMemberRoleVars);
// Variables can be defined inline as well.
const { data } = await updateTeamMemberRole({ userUid: ..., teamId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTeamMemberRole(dataConnect, updateTeamMemberRoleVars);

console.log(data.teamMembership_update);

// Or, you can use the `Promise` API.
updateTeamMemberRole(updateTeamMemberRoleVars).then((response) => {
  const data = response.data;
  console.log(data.teamMembership_update);
});
```

### Using `UpdateTeamMemberRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTeamMemberRoleRef, UpdateTeamMemberRoleVariables } from '@dataconnect/generated';

// The `UpdateTeamMemberRole` mutation requires an argument of type `UpdateTeamMemberRoleVariables`:
const updateTeamMemberRoleVars: UpdateTeamMemberRoleVariables = {
  userUid: ..., 
  teamId: ..., 
  role: ..., 
};

// Call the `updateTeamMemberRoleRef()` function to get a reference to the mutation.
const ref = updateTeamMemberRoleRef(updateTeamMemberRoleVars);
// Variables can be defined inline as well.
const ref = updateTeamMemberRoleRef({ userUid: ..., teamId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTeamMemberRoleRef(dataConnect, updateTeamMemberRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamMembership_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMembership_update);
});
```

