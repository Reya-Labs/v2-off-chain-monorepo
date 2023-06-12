import { getRedisClient } from '@voltz-protocol/commons-v2';
import { getActiveSwapsMaxEventBlock } from '../../big-query-support/active-swaps-table/pull-data/getActiveSwapsMaxEventBlock';
import { getMarginUpdatesMaxEventBlock } from '../../big-query-support/margin-updates-table/pull-data/getMarginUpdatesMaxEventBlock';
import { getMintsAndBurnsMaxEventBlock } from '../../big-query-support/mints-and-burns-table/pull-data/getMintsAndBurnsMaxEventBlock';
import { getPoolsMaxEventBlock } from '../../big-query-support/pools-table/pull-data/getPoolsMaxEventBlock';
import { getPositionsMaxEventBlock } from '../../big-query-support/positions-table/pull-data/getPositionsMaxEventBlock';
import { getRedisID } from '../constants';
import { getCurrentTick } from '../contract-services/getCurrentTick';

export const getInformationPerVAMM = async (
  information:
    | 'last_block_active_swaps'
    | 'last_block_mints_and_burns'
    | 'last_block_pnl'
    | 'last_tick_pnl',
  chainId: number,
  vammAddress: string,
): Promise<{
  id: string;
  value: number;
}> => {
  const redisClient = getRedisClient();
  const key = `${getRedisID()}_${information}_${chainId}_${vammAddress}`;
  const value = await redisClient.get(key);

  if (value) {
    return {
      id: key,
      value: Number(value),
    };
  }

  // Key is not present in Redis cache, try to fetch it from BigQuery
  switch (information) {
    case 'last_block_active_swaps': {
      const latestBlock = await getActiveSwapsMaxEventBlock(
        vammAddress,
        chainId,
      );
      return {
        id: key,
        value: latestBlock || 0,
      };
    }
    case 'last_block_mints_and_burns': {
      const latestBlock = await getMintsAndBurnsMaxEventBlock(
        vammAddress,
        chainId,
      );
      return {
        id: key,
        value: latestBlock || 0,
      };
    }
    case 'last_block_pnl': {
      const latestBlock = await getPositionsMaxEventBlock(vammAddress, chainId);
      return {
        id: key,
        value: latestBlock || 0,
      };
    }
    case 'last_tick_pnl': {
      const latestBlock = await getPositionsMaxEventBlock(vammAddress, chainId);
      const latestTick = latestBlock
        ? await getCurrentTick(chainId, vammAddress, latestBlock)
        : 0;

      return {
        id: key,
        value: latestTick,
      };
    }
  }
};

export const getInformationPerMarginEngine = async (
  information: 'last_block_margin_updates',
  chainId: number,
  marginEngineAddress: string,
): Promise<{
  id: string;
  value: number;
}> => {
  const redisClient = getRedisClient();
  const key = `${getRedisID()}_${information}_${chainId}_${marginEngineAddress}`;
  const value = await redisClient.get(key);

  if (value) {
    return {
      id: key,
      value: Number(value),
    };
  }

  // Key is not present in Redis cache, try to fetch it from BigQuery
  switch (information) {
    case 'last_block_margin_updates': {
      const latestBlock = await getMarginUpdatesMaxEventBlock(
        marginEngineAddress,
        chainId,
      );
      return {
        id: key,
        value: latestBlock || 0,
      };
    }
  }
};

export const getInformationPerChain = async (
  information: 'last_block_pools',
  chainId: number,
): Promise<{
  id: string;
  value: number;
}> => {
  const redisClient = getRedisClient();
  const key = `${getRedisID()}_${information}_${chainId}`;
  const value = await redisClient.get(key);

  if (value) {
    return {
      id: key,
      value: Number(value),
    };
  }

  // Key is not present in Redis cache, try to fetch it from BigQuery
  switch (information) {
    case 'last_block_pools': {
      const latestBlock = await getPoolsMaxEventBlock(chainId);

      return {
        id: key,
        value: latestBlock || 0,
      };
    }
  }
};

export const setRedis = async (key: string, value: number): Promise<void> => {
  const redisClient = getRedisClient();
  await redisClient.set(key, value);
};
