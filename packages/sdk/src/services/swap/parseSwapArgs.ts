import { scale } from '@voltz-protocol/commons-v2';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { SwapArgs, CompleteSwapDetails } from './types';

export const parseSwapArgs = async ({
  ammId,
  signer,
  notional,
  margin,
}: SwapArgs): Promise<CompleteSwapDetails> => {
  const chainId = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);

  // Check that signer is connected to the right network
  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  // Decode some information from pool
  const quoteTokenDecimals = poolInfo.underlyingToken.tokenDecimals;
  const currentLiquidityIndex = poolInfo.currentLiquidityIndex;

  const maturityTimestamp = Math.round(poolInfo.termEndTimestampInMS / 1000);

  // Get base amount
  const baseAmount = notional / currentLiquidityIndex;

  // Build parameters
  const params: CompleteSwapDetails = {
    chainId,
    signer,

    poolId: poolInfo.id,

    productAddress: poolInfo.productAddress,
    marketId: poolInfo.marketId,
    fee: 0, // todo: replace by pool.takerFee
    maturityTimestamp,
    currentLiquidityIndex,

    quoteTokenAddress: poolInfo.underlyingToken.address,
    quoteTokenDecimals,

    accountId: undefined,
    accountMargin: 0,

    userNotional: notional,

    ownerAddress: await signer.getAddress(),

    baseAmount: scale(quoteTokenDecimals)(baseAmount),

    margin: scale(quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(quoteTokenDecimals)(1),
    isETH: poolInfo.underlyingToken.priceUSD > 1,
  };

  console.log('swap params:', params);

  return params;
};
