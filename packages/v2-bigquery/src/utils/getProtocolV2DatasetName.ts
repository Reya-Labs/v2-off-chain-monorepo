import { getEnvironmentV2 } from './envVars';

export const getProtocolV2DatasetName = (): string => {
  const tag = getEnvironmentV2();
  return `${tag}_protocol_dated_irs_v2`;
};
