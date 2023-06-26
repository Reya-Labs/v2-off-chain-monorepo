import {
  SECONDS_IN_YEAR,
  getBlockAtTimestamp,
  getTimeInYearsBetweenTimestamps,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import {
  getLiquidityIndex,
  pullExistingPositionRow,
} from '@voltz-protocol/indexer-v1';
import { PositionPnL } from '../../old-v1-queries/position-pnl/types';
import { getProvider } from '../../services/getProvider';

export const getPositionPnL = async (
  chainId: number,
  vammAddress: string,
  ownerAddress: string,
  tickLower: number,
  tickUpper: number,
  marginEngineAddress: string,
  maturityTimestampMS: number,
  currentFixedRate: number,
): Promise<PositionPnL> => {
  const maturityTimestamp = Math.floor(maturityTimestampMS / 1000);
  const existingPosition = await pullExistingPositionRow(
    chainId,
    vammAddress,
    ownerAddress,
    tickLower,
    tickUpper,
  );

  if (!existingPosition) {
    return {
      realizedPnLFromSwaps: 0,
      realizedPnLFromFeesPaid: 0,
      realizedPnLFromFeesCollected: 0,
      unrealizedPnLFromSwaps: 0,
      fixedRateLocked: 0,
    };
  }

  let currentTimestamp = getTimestampInSeconds();
  let currentLiquidityIndex = 1;

  if (maturityTimestamp >= currentTimestamp) {
    currentLiquidityIndex = await getLiquidityIndex(
      chainId,
      marginEngineAddress,
    );
  } else {
    const blockAtSettlement = await getBlockAtTimestamp(
      getProvider(chainId),
      maturityTimestamp,
    );

    currentLiquidityIndex = await getLiquidityIndex(
      chainId,
      marginEngineAddress,
      blockAtSettlement,
    );

    currentTimestamp = maturityTimestamp;
  }

  // realized PnL
  const rPnL =
    existingPosition.cashflowLiFactor * currentLiquidityIndex +
    (existingPosition.cashflowTimeFactor * currentTimestamp) / SECONDS_IN_YEAR +
    existingPosition.cashflowFreeTerm;

  // unrealized PnL
  const timeInYears = getTimeInYearsBetweenTimestamps(
    currentTimestamp,
    maturityTimestamp,
  );

  const uPnL =
    existingPosition.netNotionalLocked *
    (currentFixedRate - existingPosition.netFixedRateLocked) *
    timeInYears;

  return {
    realizedPnLFromSwaps: rPnL,
    realizedPnLFromFeesPaid: existingPosition.realizedPnLFromFeesPaid,
    realizedPnLFromFeesCollected: existingPosition.realizedPnLFromFeesCollected,
    unrealizedPnLFromSwaps: uPnL,
    fixedRateLocked: existingPosition.netFixedRateLocked,
  };
};
