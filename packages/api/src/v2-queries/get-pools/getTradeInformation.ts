import { decodeV2PoolId, isNull } from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import { getCurrentVammTick, getTradeMove } from '@voltz-protocol/bigquery-v2';
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

  const currentTick = await getCurrentVammTick(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
  );

  if (isNull(currentTick)) {
    return defaultResponse;
  }

  const move = await getTradeMove(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
    currentTick as number,
    baseToTrade,
  );

  return {
    avgFix: move.avgFix,
    availableBase: move.base,
  };
};
