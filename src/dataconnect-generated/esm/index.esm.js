import {
  executeMutation,
  executeQuery,
  mutationRef,
  queryRef,
  validateArgs,
  validateArgsWithOptions,
} from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'equpo-service',
  location: 'us-east4',
};
export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
};
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUserRef(dcInstance, inputVars));
}

export const touchUserLastActiveRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TouchUserLastActive');
};
touchUserLastActiveRef.operationName = 'TouchUserLastActive';

export function touchUserLastActive(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(touchUserLastActiveRef(dcInstance, inputVars));
}

export const getUserRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
};
getUserRef.operationName = 'GetUser';

export function getUser(dcOrOptions, options) {
  const {
    dc: dcInstance,
    vars: inputVars,
    options: inputOpts,
  } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined, false, false);
  return executeQuery(getUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
