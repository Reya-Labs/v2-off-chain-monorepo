import { getEnvironmentV2 } from '@voltz-protocol/commons-v2';

export const getProtocolV2DatasetName = (): string => {
  const tag = getEnvironmentV2();
  return `${tag}_protocol_dated_irs_v2`;
};
