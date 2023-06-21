import { SECONDS_IN_DAY } from '@voltz-protocol/commons-v2';
import { pullAllChainPools } from '../big-query-support/pools-table/pull-data/pullAllChainPools';
import { BigQueryPoolRow } from '../big-query-support/types';

export const getAmms = async (chainId: number): Promise<BigQueryPoolRow[]> => {
  const amms = await pullAllChainPools([chainId]);

  return amms.filter(
    (amm) =>
      amm.vamm.toLowerCase() === '0x22393f23f16925d282aeca0a8464dccaf10ee480',
  );
};

export const getRecentAmms = async (
  chainId: number,
): Promise<BigQueryPoolRow[]> => {
  const amms = await pullAllChainPools([chainId]);

  const timestamp = Date.now().valueOf() - 30 * SECONDS_IN_DAY * 1000;
  const recentAmms = amms.filter(
    (amm) => amm.termEndTimestampInMS >= timestamp,
  );

  return recentAmms;
};

export const getActiveAmms = async (
  chainId: number,
): Promise<BigQueryPoolRow[]> => {
  const amms = await pullAllChainPools([chainId]);

  const now = Date.now().valueOf();
  const activeAmms = amms.filter((amm) => amm.termEndTimestampInMS >= now);

  return activeAmms;
};
