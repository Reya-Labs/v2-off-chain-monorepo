import { getEnvironment } from '@voltz-protocol/commons-v2';

export const getProtocolV2DatasetName = (): string => {
  const tag = getEnvironment();
  return `${tag}_protocol_dated_irs_v2`;
};
