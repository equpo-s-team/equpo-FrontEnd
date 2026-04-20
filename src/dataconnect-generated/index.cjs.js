const {
  queryRef,
  executeQuery,
  validateArgsWithOptions,
  mutationRef,
  executeMutation,
  validateArgs,
} = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'equpo-service',
  location: 'us-east4',
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
};
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUserRef(dcInstance, inputVars));
};

const touchUserLastActiveRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TouchUserLastActive');
};
touchUserLastActiveRef.operationName = 'TouchUserLastActive';
exports.touchUserLastActiveRef = touchUserLastActiveRef;

exports.touchUserLastActive = function touchUserLastActive(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(touchUserLastActiveRef(dcInstance, inputVars));
};

const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
};
updateUserProfileRef.operationName = 'UpdateUserProfile';
exports.updateUserProfileRef = updateUserProfileRef;

exports.updateUserProfile = function updateUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserProfileRef(dcInstance, inputVars));
};

const getUserRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
};
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dcOrOptions, options) {
  const {
    dc: dcInstance,
    vars: inputVars,
    options: inputOpts,
  } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined, false, false);
  return executeQuery(getUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
};
