import {
  fixedRateToSpacedTick,
  getLiquidityFromBase,
  scale,
} from '@voltz-protocol/commons-v2';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { CompleteLpDetails, LpArgs } from './types';

export const parseLpArgs = async ({
  ammId,
  signer,
  notional,
  margin,
  fixedLow,
  fixedHigh,
}: LpArgs): Promise<CompleteLpDetails> => {
  if (fixedLow >= fixedHigh) {
    throw new Error(`Invalid LP range: [${fixedLow}%, ${fixedHigh}%]`);
  }

  const poolInfo = await getPoolInfo(ammId);
  const chainId = await signer.getChainId();

  // Check that signer is connected to the right network
  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Convert fixed rates to ticks
  const tickLower = fixedRateToSpacedTick(
    fixedHigh / 100,
    poolInfo.tickSpacing,
  );
  const tickUpper = fixedRateToSpacedTick(fixedLow / 100, poolInfo.tickSpacing);

  // Get liquidity amount
  const base = notional / poolInfo.currentLiquidityIndex;
  const liquidityAmount = getLiquidityFromBase(base, tickLower, tickUpper);

  // Build parameters
  const params: CompleteLpDetails = {
    chainId,
    signer,

    productAddress: poolInfo.productAddress,
    marketId: poolInfo.marketId,
    maturityTimestamp: poolInfo.maturityTimestamp,

    quoteTokenAddress: poolInfo.quoteTokenAddress,
    quoteTokenDecimals: poolInfo.quoteTokenDecimals,

    accountId: undefined,
    accountMargin: 0,

    ownerAddress: await signer.getAddress(),
    tickLower,
    tickUpper,

    liquidityAmount: scale(poolInfo.quoteTokenDecimals)(liquidityAmount),

    margin: scale(poolInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(poolInfo.quoteTokenDecimals)(1),
    isETH: poolInfo.isETH,
  };

  console.log('lp params:', params);

  return params;
};
