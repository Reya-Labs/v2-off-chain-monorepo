import { getEnvironmentV2 } from '../services/envVars';

export const getLoggingDirectory = (): string => {
  const dir = `./logs/${getEnvironmentV2()}`;
  return dir;
};
