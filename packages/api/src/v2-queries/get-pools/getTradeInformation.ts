import { decodeV2PoolId } from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import {
  getTradeMove,
  pullIrsVammPoolEntry,
} from '@voltz-protocol/bigquery-v2';
import { V2TradeInformation } from '@voltz-protocol/api-v2-types';

const defaultResponse: V2TradeInformation = {
  availableBase: 0,
  avgFix: 0,
};

export const getV2TradeInformation = async (
  poolId: string,
  baseToTrade: number,
): Promise<V2TradeInformation> => {
  const environmentTag = getEnvironmentV2();
  const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);

  const pool = await pullIrsVammPoolEntry(getEnvironmentV2(), poolId);

  if (pool === null) {
    console.error(
      `Could not find pool ${chainId}-${marketId}-${maturityTimestamp}`,
    );

    return defaultResponse;
  }

  const move = await getTradeMove(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
    pool.currentTick,
    baseToTrade,
  );

  return {
    avgFix: move.avgFix,
    availableBase: move.base,
  };
};
