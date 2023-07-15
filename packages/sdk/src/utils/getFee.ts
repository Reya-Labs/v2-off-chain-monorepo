import {
  SECONDS_IN_YEAR,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';

export const getFee = (
  notional: number,
  fee: number,
  maturityTimestamp: number,
): number => {
  const now = getTimestampInSeconds();

  if (now >= maturityTimestamp) {
    return 0;
  }

  return (
    (Math.abs(notional) * fee * (maturityTimestamp - now)) / SECONDS_IN_YEAR
  );
};
