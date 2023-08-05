import { SECONDS_IN_DAY } from '@voltz-protocol/commons-v2';
import { pullAllChainPools } from '../big-query-support/pools-table/pull-data/pullAllChainPools';
import { BigQueryPoolRow } from '../big-query-support/types';

export const getAmms = async (chainId: number): Promise<BigQueryPoolRow[]> => {
  const amms = await pullAllChainPools([chainId]);

  return amms;
};

export const getRecentAmms = async (
  chainId: number,
): Promise<BigQueryPoolRow[]> => {
  const amms = await pullAllChainPools([chainId]);

  // const timestamp = Date.now().valueOf() - 30 * SECONDS_IN_DAY * 1000;
  // const recentAmms = amms.filter(
  //   (amm) => amm.termEndTimestampInMS >= timestamp,
  // );

  // return recentAmms;

  if (chainId === 1) {
    return amms.filter(
      (amm) =>
        amm.marginEngine === '0x7dcd48966eb559dfa6db842ba312c96dce0cb0b2' ||
        amm.marginEngine === '0x19654a85a96da7b39aa605259ee1568e55ccb9ba',
    );
  } else if (chainId === 42161) {
    return amms.filter(
      (amm) =>
        amm.marginEngine === '0x9b5b9d31c7b4a826cd30c09136a2fdea9c69efcd',
    );
  }

  throw new Error('local: unsupported chain id');
};

export const getActiveAmms = async (
  chainId: number,
): Promise<BigQueryPoolRow[]> => {
  // const amms = await pullAllChainPools([chainId]);

  // const now = Date.now().valueOf();
  // const activeAmms = amms.filter((amm) => amm.termEndTimestampInMS >= now);

  // return activeAmms;

  return getRecentAmms(chainId);
};
