export const SERVICES_URL = import.meta.env.VUE_ENV_VALIDATOR_SERVICES_URL;
export const API_KEY_NAME = import.meta.env.VUE_ENV_VALIDATOR_SERVICES_KEY_NAME;
export const API_KEY_VALUE = import.meta.env.VUE_ENV_VALIDATOR_SERVICES_KEY_VALUE;

export const buildServicesEndpoint = (endpoint) => `${SERVICES_URL}${endpoint}`;

export const getServicesCredentials = () => {
  return [import.meta.env.VUE_ENV_VALIDATOR_SERVICES_KEY_NAME, import.meta.env.VUE_ENV_VALIDATOR_SERVICES_KEY_VALUE];
};

export const getDefaultServicesAPIOptions = () => {
  return { headers: { [API_KEY_NAME]: API_KEY_VALUE } };
};

export * from './organisations';
export * from './documents';
