const {
  createUserRef,
  touchUserLastActiveRef,
  getUserRef,
  connectorConfig,
} = require('../index.cjs.js');
const { validateArgs, CallerSdkTypeEnum } = require('firebase/data-connect');
const {
  useDataConnectQuery,
  useDataConnectMutation,
  validateReactArgs,
} = require('@tanstack-query-firebase/react/data-connect');

exports.useCreateUser = function useCreateUser(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return createUserRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
};

exports.useTouchUserLastActive = function useTouchUserLastActive(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory() {
    return touchUserLastActiveRef(dcInstance);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
};

exports.useGetUser = function useGetUser(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  const ref = getUserRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
};
