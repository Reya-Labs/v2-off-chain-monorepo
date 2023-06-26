import {
  SECONDS_IN_YEAR,
  getBlockAtTimestamp,
  getTimeInYearsBetweenTimestamps,
  tickToFixedRate,
} from '@voltz-protocol/commons-v2';
import { PositionPnL } from './types';
import {
  getCurrentTick,
  getLiquidityIndex,
  pullExistingPoolRow,
  pullExistingPositionRow,
} from '@voltz-protocol/indexer-v1';
import { getProvider } from '../../services/getProvider';

export const getPositionPnL = async (
  chainId: number,
  vammAddress: string,
  ownerAddress: string,
  tickLower: number,
  tickUpper: number,
): Promise<PositionPnL> => {
  const provider = getProvider(chainId);

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

  const amm = await pullExistingPoolRow(vammAddress, chainId);

  if (!amm) {
    throw new Error(`Couldn't fetch AMM with address ${vammAddress}.`);
  }

  const maturityTimestamp = Math.floor(amm.termEndTimestampInMS / 1000);
  let currentTimestamp = (await provider.getBlock('latest')).timestamp;

  let currentLiquidityIndex = 1;

  if (maturityTimestamp >= currentTimestamp) {
    currentLiquidityIndex = await getLiquidityIndex(chainId, amm.marginEngine);
  } else {
    const blockAtSettlement = await getBlockAtTimestamp(
      getProvider(chainId),
      maturityTimestamp,
    );

    currentLiquidityIndex = await getLiquidityIndex(
      chainId,
      amm.marginEngine,
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
  const currentTick = await getCurrentTick(chainId, vammAddress);
  const currentFixedRate = tickToFixedRate(currentTick);

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
