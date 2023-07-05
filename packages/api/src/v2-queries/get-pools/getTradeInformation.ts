import {
  decodeV2PoolId,
  getTimestampInSeconds,
  isNull,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import {
  getCurrentVammTick,
  getLiquidityIndexAt,
  getTradeMove,
  pullMarketEntry,
} from '@voltz-protocol/bigquery-v2';
import { V2TradeInformation } from '@voltz-protocol/api-v2-types';

const defaultResponse: V2TradeInformation = {
  availableNotional: 0,
  availableBase: 0,
  currentLiquidityIndex: 1,
  avgFix: 0,
};

export const getV2TradeInformation = async (
  poolId: string,
  notionalToTrade: number,
): Promise<V2TradeInformation> => {
  const environmentTag = getEnvironmentV2();
  const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);

  const market = await pullMarketEntry(environmentTag, chainId, marketId);

  if (!market) {
    return defaultResponse;
  }

  const currentTick = await getCurrentVammTick(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
  );

  const liquidityIndex = await getLiquidityIndexAt(
    environmentTag,
    chainId,
    market.oracleAddress,
    getTimestampInSeconds(),
  );

  if (isNull(currentTick) || isNull(liquidityIndex) || liquidityIndex === 0) {
    return defaultResponse;
  }

  const baseToTrade = notionalToTrade / (liquidityIndex as number);

  const move = await getTradeMove(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
    currentTick as number,
    baseToTrade,
  );

  return {
    availableNotional: move.base * (liquidityIndex as number),
    avgFix: move.avgFix,
    availableBase: move.base,
    currentLiquidityIndex: liquidityIndex as number,
  };
};
