import { ethers } from 'ethers';

import { SECONDS_IN_YEAR } from './constants';

export const getTimestampInSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const getTimeInYearsBetweenTimestamps = (
  from: number,
  to: number,
): number => {
  if (from > to) {
    throw new Error(`Unordered timestamps ${from}-${to}`);
  }

  return (to - from) / SECONDS_IN_YEAR;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getBlockAtTimestamp(
  provider: ethers.providers.Provider,
  timestamp: number,
) {
  let lo = 0;
  let hi = (await provider.getBlock('latest')).number;
  let answer = 0;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midBlock = await provider.getBlock(mid);

    if (midBlock.timestamp >= timestamp) {
      answer = midBlock.number;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return answer;
}
