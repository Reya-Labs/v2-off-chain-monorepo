import {
  SECONDS_IN_YEAR,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';

export const getFee = (
  notional: number,
  atomicFee: number,
  maturityTimestamp: number,
): number => {
  const now = getTimestampInSeconds();

  if (now >= maturityTimestamp) {
    return 0;
  }

  // Buffer for fee: When computing fee off-chain, it does not correspond 1:1 to on-chain because of timestamp.
  // Hence, we need to add some buffer for the tx to be safer.
  const buffer = 0.01;

  const timeDelta = (maturityTimestamp - now) / SECONDS_IN_YEAR;
  const fee = Math.abs(notional) * atomicFee * timeDelta;

  return fee * (1 + buffer);
};
