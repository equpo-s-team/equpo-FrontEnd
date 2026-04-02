# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useTouchUserLastActive, useUpdateUser, useGetUser, useCreateTeam, useUpdateTeam, useCreateAchievement, useUpdateAchievement, useCreateReward, useUpdateReward } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useTouchUserLastActive();

const { data, isPending, isSuccess, isError, error } = useUpdateUser(updateUserVars);

const { data, isPending, isSuccess, isError, error } = useGetUser();

const { data, isPending, isSuccess, isError, error } = useCreateTeam(createTeamVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTeam(updateTeamVars);

const { data, isPending, isSuccess, isError, error } = useCreateAchievement(createAchievementVars);

const { data, isPending, isSuccess, isError, error } = useUpdateAchievement(updateAchievementVars);

const { data, isPending, isSuccess, isError, error } = useCreateReward(createRewardVars);

const { data, isPending, isSuccess, isError, error } = useUpdateReward(updateRewardVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, touchUserLastActive, updateUser, getUser, createTeam, updateTeam, createAchievement, updateAchievement, createReward, updateReward } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation TouchUserLastActive: 
const { data } = await TouchUserLastActive(dataConnect);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation CreateTeam:  For variables, look at type CreateTeamVars in ../index.d.ts
const { data } = await CreateTeam(dataConnect, createTeamVars);

// Operation UpdateTeam:  For variables, look at type UpdateTeamVars in ../index.d.ts
const { data } = await UpdateTeam(dataConnect, updateTeamVars);

// Operation CreateAchievement:  For variables, look at type CreateAchievementVars in ../index.d.ts
const { data } = await CreateAchievement(dataConnect, createAchievementVars);

// Operation UpdateAchievement:  For variables, look at type UpdateAchievementVars in ../index.d.ts
const { data } = await UpdateAchievement(dataConnect, updateAchievementVars);

// Operation CreateReward:  For variables, look at type CreateRewardVars in ../index.d.ts
const { data } = await CreateReward(dataConnect, createRewardVars);

// Operation UpdateReward:  For variables, look at type UpdateRewardVars in ../index.d.ts
const { data } = await UpdateReward(dataConnect, updateRewardVars);


```